import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, CreditCard, Sparkles } from 'lucide-react';
import { StoreProduct } from '../types';

interface CartItem {
  product: StoreProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  primaryColor: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  primaryColor,
}: CartDrawerProps) {
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'shipping' | 'complete'>('idle');
  const [shippingForm, setShippingForm] = useState({ name: '', phone: '', address: '' });

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('shipping');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCheckoutStep('complete');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-transform duration-300">
          <div className="flex h-full flex-col justify-between bg-zinc-950 text-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 p-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-zinc-400" />
                <span className="text-lg font-medium">购物袋 ({cart.length})</span>
              </div>
              <button onClick={onClose} className="rounded-md p-1.5 hover:bg-zinc-800 transition-colors">
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            {/* Steps & Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {checkoutStep === 'idle' && (
                <>
                  {cart.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
                      <div className="rounded-full bg-zinc-900 p-4">
                        <ShoppingBag className="h-10 w-10 text-zinc-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-300">购物袋空空如也</p>
                        <p className="text-sm text-zinc-500 mt-1">快去主页臻选一些惊艳的商品吧！</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-20 w-20 rounded-md object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <h4 className="font-medium text-sm text-zinc-200 line-clamp-1">{item.product.name}</h4>
                              <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{item.product.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-semibold text-zinc-100">¥ {item.product.price}</span>
                              <div className="flex items-center gap-2.5 bg-zinc-800 px-2 p-1 rounded-md">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, -1)}
                                  className="text-zinc-400 hover:text-white"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, 1)}
                                  className="text-zinc-400 hover:text-white"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'shipping' && (
                <form onSubmit={handlePlaceOrder} className="space-y-4 text-zinc-100">
                  <h3 className="text-base font-semibold border-b border-zinc-800 pb-2">填写配送信息</h3>
                  
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">收货人姓名</label>
                    <input
                      required
                      type="text"
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neutral-500"
                      placeholder="您的姓名"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">联系电话</label>
                    <input
                      required
                      type="tel"
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neutral-500"
                      placeholder="手机或座机"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">配送地址</label>
                    <textarea
                      required
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neutral-500 h-20"
                      placeholder="省份、城市、区县及详细街道门牌"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    />
                  </div>

                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 mt-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <CreditCard className="h-4 w-4" />
                      <span>支付方式：支持微信支付、支付宝、货到付款</span>
                    </div>
                  </div>
                </form>
              )}

              {checkoutStep === 'complete' && (
                <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                  <div className="rounded-full bg-emerald-950 p-4 border border-emerald-900">
                    <Sparkles className="h-10 w-10 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">🎉 预购订单提交成功</h3>
                    <p className="text-sm text-zinc-400 mt-2 px-6">
                      感谢您的惠顾，顾客 <b>{shippingForm.name}</b>！我们已经收到了您的购买意向。
                    </p>
                    <div className="text-left bg-zinc-900 p-4 rounded-lg text-xs space-y-1.5 border border-zinc-800 mt-4 max-w-sm mx-auto">
                      <div className="text-zinc-500">配送单号: <span className="font-mono text-zinc-300">AIS-{Date.now().toString().slice(-8)}</span></div>
                      <div className="text-zinc-500">配送地址: <span className="text-zinc-300">{shippingForm.address}</span></div>
                      <div className="text-zinc-500">联系电话: <span className="text-zinc-300">{shippingForm.phone}</span></div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClearCart();
                      setCheckoutStep('idle');
                      onClose();
                    }}
                    style={{ backgroundColor: primaryColor }}
                    className="w-full max-w-xs mt-4 rounded-md py-2.5 text-sm font-semibold text-white filter brightness-95 hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    返回商店
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {checkoutStep !== 'complete' && cart.length > 0 && (
              <div className="border-t border-zinc-800 p-5 space-y-4 bg-zinc-950">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">商品总计</span>
                  <span className="font-semibold text-zinc-100 text-lg">¥ {totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>配送运费</span>
                  <span className="text-emerald-400">首单包邮</span>
                </div>

                {checkoutStep === 'idle' ? (
                  <button
                    onClick={handleCheckout}
                    style={{ backgroundColor: primaryColor }}
                    className="w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-white filter brightness-95 hover:brightness-110 transition-all select-none"
                  >
                    立即去结算
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('idle')}
                      className="flex-1 rounded-md border border-zinc-800 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-900 transition-colors"
                    >
                      返回
                    </button>
                    <button
                      type="submit"
                      onClick={handlePlaceOrder}
                      disabled={checkingOut || !shippingForm.name || !shippingForm.address}
                      style={{ backgroundColor: primaryColor }}
                      className="flex-3 flex items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-white filter brightness-95 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {checkingOut ? '正在模拟下单...' : '确认并支付'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

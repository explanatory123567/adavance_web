import React, { useState } from 'react';
import './OrdersPage.css';
import { useApp } from '../context/AppContext';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, XCircle, Download, ChevronDown, ChevronUp } from 'lucide-react';
const statusBadge = status => {
  switch (status) {
    case 'Completed':
      return <span className="badge badge-green"><CheckCircle2 size={11} /> Completed</span>;
    case 'Shipped':
      return <span className="badge badge-cyan"><Truck size={11} /> Shipped</span>;
    case 'Processing':
      return <span className="badge badge-purple"><Clock size={11} /> Processing</span>;
    case 'Pending':
      return <span className="badge badge-amber"><AlertCircle size={11} /> Pending</span>;
    case 'Cancelled':
      return <span className="badge badge-red"><XCircle size={11} /> Cancelled</span>;
    default:
      return <span className="badge">{status}</span>;
  }
};
export default function OrdersPage() {
  const {
    orders,
    showToast
  } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(orders[0]?.id || null);
  const filteredOrders = orders.filter(o => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    return true;
  });
  const toggleExpand = id => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };
  return <div className="orders-page inline-orderspage-0">
      <div className="container-wide">
        {/* Header */}
        <div className="flex-between inline-orderspage-1">
          <div>
            <div className="inline-orderspage-2">
              <span className="badge badge-cyan">LOGISTICS & TRACKING</span>
              <span className="inline-orderspage-3">
                {orders.length} Total Orders Registered
              </span>
            </div>
            <h1 className="inline-orderspage-4">Order History & Telemetry</h1>
            <p className="inline-orderspage-5">
              Real-time laboratory assembly progress, carrier dispatch tracking, and digital invoices.
            </p>
          </div>

          {/* Filter Status Tabs */}
          <div className="inline-orderspage-6">
            {['all', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(st => <button key={st} onClick={() => setFilterStatus(st)} style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'capitalize',
            background: filterStatus === st ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
            color: filterStatus === st ? 'var(--neon-cyan)' : 'var(--text-muted)'
          }}>
                {st}
              </button>)}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? <div className="cyber-card-static inline-orderspage-7">
            <Package size={48} color="var(--text-muted)" className="inline-orderspage-8" />
            <h3 className="inline-orderspage-9">No Orders Found</h3>
            <p className="inline-orderspage-10">
              No orders currently match the selected status filter.
            </p>
          </div> : <div className="inline-orderspage-11">
            {filteredOrders.map(order => {
          const isExpanded = expandedOrderId === order.id;
          return <div key={order.id} className="cyber-card-static inline-orderspage-12">
                  {/* Order Top Bar */}
                  <div onClick={() => toggleExpand(order.id)} className="inline-orderspage-13">
                    <div className="inline-orderspage-14">
                      <div>
                        <div className="inline-orderspage-15">Order ID</div>
                        <div className="inline-orderspage-16">
                          #{order.id}
                        </div>
                      </div>

                      <div>
                        <div className="inline-orderspage-17">Date Placed</div>
                        <div className="inline-orderspage-18">
                          {order.date}
                        </div>
                      </div>

                      <div>
                        <div className="inline-orderspage-19">Total Billed</div>
                        <div className="inline-orderspage-20">
                          ₱{order.total?.toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}
                        </div>
                      </div>
                    </div>

                    <div className="inline-orderspage-21">
                      {statusBadge(order.status)}

                      <button onClick={e => {
                  e.stopPropagation();
                  showToast('Invoice Downloaded', `PDF for Order #${order.id} generated.`, 'info');
                }} className="btn btn-secondary btn-sm inline-orderspage-22">
                        <Download size={13} /> Invoice
                      </button>

                      {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                    </div>
                  </div>

                  {/* Expandable Order Details & Tracking Bar */}
                  {isExpanded && <div className="inline-orderspage-23">
                      {/* Tracking Progress Timeline */}
                      {order.status !== 'Cancelled' && <div className="inline-orderspage-24">
                          <div className="inline-orderspage-25">
                            Telemetry Tracking ({order.trackingNumber || 'Carrier Assigned'})
                          </div>

                          <div className="inline-orderspage-26">
                            {/* Connecting Line */}
                            <div className="inline-orderspage-27" />

                            {[{
                    label: 'Order Placed',
                    active: true
                  }, {
                    label: 'Lab Assembly & Stress-Test',
                    active: ['Processing', 'Shipped', 'Completed'].includes(order.status)
                  }, {
                    label: 'Carrier In-Transit',
                    active: ['Shipped', 'Completed'].includes(order.status)
                  }, {
                    label: 'Delivered',
                    active: order.status === 'Completed'
                  }].map((step, idx) => <div key={idx} className="inline-orderspage-28">
                                <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: step.active ? 'var(--neon-cyan)' : '#1e293b',
                      color: step.active ? '#070913' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      fontWeight: 800,
                      fontSize: '12px',
                      boxShadow: step.active ? '0 0 15px var(--neon-cyan-glow)' : 'none'
                    }}>
                                  ✓
                                </div>
                                <div style={{
                      fontSize: '12px',
                      fontWeight: step.active ? 700 : 400,
                      color: step.active ? '#fff' : 'var(--text-muted)'
                    }}>
                                  {step.label}
                                </div>
                              </div>)}
                          </div>
                        </div>}

                      {/* Items Ordered List */}
                      <div>
                        <div className="inline-orderspage-29">
                          Included Hardware Components
                        </div>

                        <div className="inline-orderspage-30">
                          {order.items?.map((item, idx) => <div key={idx} className="inline-orderspage-31">
                              <div className="inline-orderspage-32">
                                {item.image && <img src={item.image} alt={item.name} className="inline-orderspage-33" />}
                                <div>
                                  <div className="inline-orderspage-34">{item.name}</div>
                                  <div className="inline-orderspage-35">Qty: {item.quantity}</div>
                                </div>
                              </div>

                              <div className="inline-orderspage-36">
                                ₱{(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>)}
                        </div>
                      </div>
                    </div>}
                </div>;
        })}
          </div>}
      </div>
    </div>;
}

'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Bot,
  Zap,
  Tag,
  DollarSign,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auditTrailService, type AuditEvent } from '@/lib/commerce/audit-trail';

export function AuditTrailView() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auditTrailService.subscribe((updated) => {
      setEvents(updated);
    });
    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter((e) => {
    if (filterStatus !== 'ALL' && e.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.action.toLowerCase().includes(q) ||
        e.entity.toLowerCase().includes(q) ||
        e.customerName.toLowerCase().includes(q) ||
        e.agentName.toLowerCase().includes(q) ||
        e.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportAuditLog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vyaparmind_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40 flex items-center gap-1">
              <ShieldCheck className="size-3.5" />
              100% Auditable & Traceable
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">Agent Activity & Audit Trail</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all AI intent detections, catalog verifications, policy evaluations, and Razorpay transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportAuditLog}
            variant="outline"
            className="rounded-xl border-slate-800 bg-slate-900/80 text-slate-300 text-xs font-semibold gap-2 hover:text-white"
          >
            <Download className="size-3.5" />
            Export Audit Log
          </Button>

          <Button
            onClick={() => auditTrailService.clear()}
            variant="outline"
            className="rounded-xl border-slate-800 bg-slate-900/80 text-slate-400 text-xs font-semibold gap-1.5 hover:text-white"
          >
            <RotateCcw className="size-3.5" />
            Reset Log
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-80 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <Search className="size-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by action, agent, customer, or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-slate-200 placeholder:text-slate-500 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'SUCCESS', 'WARNING', 'FAILED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/30 text-slate-500 text-xs">
            No audit events found matching criteria.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-purple-400 font-semibold bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
                    {evt.timestamp}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{evt.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({evt.id})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Bot className="size-3.5 text-indigo-400" />
                    {evt.agentName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      evt.status === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : evt.status === 'FAILED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-8 space-y-1.5">
                  <div className="text-slate-300 font-medium">
                    Entity: <span className="text-white font-semibold">{evt.entity}</span>
                    {evt.amount && (
                      <span className="ml-2 text-emerald-400 font-bold">
                        (₹{evt.amount.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{evt.reason}</p>
                </div>

                <div className="md:col-span-4 space-y-1.5 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-3 pt-2 md:pt-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Customer:</span>
                    <span className="text-slate-200 font-semibold">{evt.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Confidence:</span>
                    <span className="text-purple-300 font-semibold">{evt.confidenceScore}%</span>
                  </div>
                  {evt.razorpayPaymentId && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Payment ID:</span>
                      <span className="text-emerald-400">{evt.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Badges */}
              {evt.verificationBadges && evt.verificationBadges.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/40">
                  {evt.verificationBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

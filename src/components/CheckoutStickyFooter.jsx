'use client';

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutStickyFooter({
    backLabel = 'Back',
    backHref,
    actionLabel,
    onAction,
    isActionDisabled = false,
    isActionLoading = false,
    actionIcon: ActionIcon = ArrowRight
}) {
    return (
        <div className="sticky bottom-0 mt-20 w-full bg-white border-t z-50 animate-slide-up">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

                <div>
                    {backHref && (
                        <Link
                            href={backHref}
                            className="group flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all px-4 py-2 rounded-xl hover:bg-slate-100"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">{backLabel}</span>
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onAction}
                        disabled={isActionDisabled || isActionLoading}
                        className="btn-primary flex items-center gap-2"
                    >
                        <span>{isActionLoading ? 'Processing...' : actionLabel}</span>
                        {!isActionLoading && ActionIcon && (
                            <ActionIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
} 
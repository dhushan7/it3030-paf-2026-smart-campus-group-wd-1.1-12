import React from 'react';

const STATUS_STYLES = {
    OPEN:        'bg-blue-500/20 text-blue-300 border-blue-500/30',
    IN_PROGRESS: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    RESOLVED:    'bg-green-500/20 text-green-300 border-green-500/30',
    CLOSED:      'bg-gray-500/20 text-gray-300 border-gray-500/30',
    REJECTED:    'bg-red-500/20 text-red-300 border-red-500/30',
};

const PRIORITY_STYLES = {
    LOW:    'bg-gray-500/20 text-gray-300',
    MEDIUM: 'bg-blue-500/20 text-blue-300',
    HIGH:   'bg-orange-500/20 text-orange-300',
    URGENT: 'bg-red-500/20 text-red-300',
};

export function StatusBadge({ status }) {
    const classes = STATUS_STYLES[status] ?? 'bg-gray-500/20 text-gray-300';
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs
                          font-medium border ${classes}`}>
            {status?.replace('_', ' ')}
        </span>
    );
}

export function PriorityBadge({ priority }) {
    const classes = PRIORITY_STYLES[priority] ?? 'bg-gray-500/20 text-gray-300';
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
            {priority}
        </span>
    );
}

'use client';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { ReactNode } from 'react';
import { Table } from '@/lib/types';

interface TableDroppableProps {
  id: string;
  table: Table;
  children: ReactNode;
}

export function TableDroppable({ id, table, children }: TableDroppableProps) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id });
  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
    id,
    disabled: table.mobility === 'fixed',
  });

  return (
    <g
      ref={(node) => {
        setDroppableRef(node as unknown as HTMLElement);
        setDraggableRef(node as unknown as HTMLElement);
      }}
      {...(table.mobility === 'movable' ? { ...attributes, ...listeners } : {})}
      style={{ opacity: isDragging ? 0.3 : 1 }}
    >
      {children}
    </g>
  );
}

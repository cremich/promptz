'use client'

import React from 'react'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

export function SearchFooter() {
  return (
    <div className="p-3 border-t border-border bg-muted/30">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <KbdGroup>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </KbdGroup>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <Kbd>↵</Kbd>
            <span>Select</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Kbd>Esc</Kbd>
          <span>Close</span>
        </div>
      </div>
    </div>
  )
}

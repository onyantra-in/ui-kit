import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import { cn } from "../lib/utils"

type ScrollElement = HTMLElement | null | (() => HTMLElement | null)

interface ListProps<T> {
  items: T[]
  getKey: (item: T, index: number) => React.Key
  renderItem: (item: T, index: number) => React.ReactNode
  /** Estimated row height in px; rows are measured after render. */
  estimateSize?: number
  overscan?: number
  /**
   * Existing scrollable ancestor to virtualize against (element or getter).
   * When omitted the list renders its own scroll container — give it a
   * height through `className`.
   */
  scrollElement?: ScrollElement
  className?: string
}

function resolve(el: ScrollElement | undefined) {
  return typeof el === "function" ? el() : (el ?? null)
}

function List<T>({
  items,
  getKey,
  renderItem,
  estimateSize = 64,
  overscan = 8,
  scrollElement,
  className,
}: ListProps<T>) {
  const ownRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const external = scrollElement !== undefined
  const [scrollMargin, setScrollMargin] = React.useState(0)

  // Offset of the list inside an external scroller (content above the list).
  React.useLayoutEffect(() => {
    const scroller = resolve(scrollElement)
    if (!external || !scroller || !listRef.current) return
    const update = () => {
      if (!listRef.current) return
      setScrollMargin(
        listRef.current.getBoundingClientRect().top -
          scroller.getBoundingClientRect().top +
          scroller.scrollTop
      )
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(scroller)
    return () => ro.disconnect()
  }, [external, scrollElement])

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => (external ? resolve(scrollElement) : ownRef.current),
    estimateSize: () => estimateSize,
    overscan,
    scrollMargin,
    getItemKey: (i) => getKey(items[i], i),
  })

  const list = (
    <div
      ref={listRef}
      role="list"
      data-slot="list"
      className="relative w-full"
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((row) => (
        <div
          key={row.key}
          ref={virtualizer.measureElement}
          data-index={row.index}
          role="listitem"
          className={cn("absolute left-0 top-0 w-full", row.index > 0 && "border-t border-border")}
          style={{ transform: `translateY(${row.start - scrollMargin}px)` }}
        >
          {renderItem(items[row.index], row.index)}
        </div>
      ))}
    </div>
  )

  if (external) return <div className={className}>{list}</div>
  return (
    <div ref={ownRef} className={cn("overflow-auto", className)}>
      {list}
    </div>
  )
}

interface ListItemProps {
  /** Left slot, e.g. an avatar. */
  leading?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  description?: React.ReactNode
  /** Right slot inside the link area, e.g. a count badge. */
  trailing?: React.ReactNode
  /** Right slot outside the link area, e.g. buttons. */
  actions?: React.ReactNode
  /** Plain anchor for the content area. */
  href?: string
  /**
   * Router-agnostic link: receives the classes and content to wrap, e.g.
   * `({ className, children }) => <Link to="/x" className={className}>{children}</Link>`.
   * Takes precedence over `href`.
   */
  renderLink?: (props: { className: string; children: React.ReactNode }) => React.ReactNode
  className?: string
}

function ListItem({
  leading,
  title,
  subtitle,
  description,
  trailing,
  actions,
  href,
  renderLink,
  className,
}: ListItemProps) {
  const content = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-bold text-foreground">{title}</div>
        {subtitle && <div className="truncate text-sm text-muted-foreground capitalize">{subtitle}</div>}
        {description && <div className="truncate text-sm text-muted-foreground">{description}</div>}
      </div>
      {trailing}
    </>
  )
  const body = "flex min-w-0 flex-1 items-center gap-3"
  return (
    <div
      data-slot="list-item"
      className={cn("flex items-center gap-2 bg-background py-2 hover:bg-accent", className)}
    >
      {renderLink ? (
        renderLink({ className: body, children: content })
      ) : href ? (
        <a href={href} className={body}>{content}</a>
      ) : (
        <div className={body}>{content}</div>
      )}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export { List, ListItem }
export type { ListProps, ListItemProps }

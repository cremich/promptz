import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// your design system.

const components: MDXComponents = {
  // Customize built-in components with Tailwind styling
  h1: ({ children, className, ...props }) => (
    <h1 
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6",
        "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent",
        className
      )} 
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }) => (
    <h2 
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-8 mb-4",
        className
      )} 
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }) => (
    <h3 
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3",
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, className, ...props }) => (
    <h4 
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight mt-4 mb-2",
        className
      )} 
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, className, ...props }) => (
    <p 
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6",
        className
      )} 
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, className, ...props }) => (
    <ul 
      className={cn(
        "my-6 ml-6 list-disc [&>li]:mt-2",
        className
      )} 
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }) => (
    <ol 
      className={cn(
        "my-6 ml-6 list-decimal [&>li]:mt-2",
        className
      )} 
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }) => (
    <li 
      className={cn(
        "mt-2",
        className
      )} 
      {...props}
    >
      {children}
    </li>
  ),
  blockquote: ({ children, className, ...props }) => (
    <blockquote 
      className={cn(
        "mt-6 border-l-2 border-indigo-500 pl-6 italic text-muted-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }) => (
    <code 
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )} 
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, className, ...props }) => (
    <pre 
      className={cn(
        "mb-4 mt-6 overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900",
        className
      )} 
      {...props}
    >
      {children}
    </pre>
  ),
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      className="rounded-lg border"
      {...(props as ImageProps)}
      alt={props.alt || ""}
    />
  ),
  a: ({ children, className, ...props }) => (
    <a 
      className={cn(
        "font-medium text-indigo-600 underline underline-offset-4 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300",
        className
      )} 
      {...props}
    >
      {children}
    </a>
  ),
  table: ({ children, className, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table 
        className={cn(
          "w-full border-collapse border border-border",
          className
        )} 
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, className, ...props }) => (
    <th 
      className={cn(
        "border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )} 
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, className, ...props }) => (
    <td 
      className={cn(
        "border border-border px-4 py-2 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )} 
      {...props}
    >
      {children}
    </td>
  ),
  hr: ({ className, ...props }) => (
    <hr 
      className={cn(
        "my-4 border-border",
        className
      )} 
      {...props}
    />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
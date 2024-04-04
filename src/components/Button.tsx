import { forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>((props, ref) => {
    return (
        <button 
            ref={ref}
            className="text-neutral-500 hover:text-neutral-900 h-10 min-w-10 flex items-center justify-center gap-2 p-2 hover:bg-neutral-100 rounded-lg"
            {...props}
        />
    )
})
import { Check } from "@phosphor-icons/react/dist/ssr"
import * as Dropdown from "@radix-ui/react-dropdown-menu"

export function DropdownContent({ children, align, onKeyDown }: { children: React.ReactNode, align: "center" | "start" | "end" | undefined, onKeyDown?: (e: React.KeyboardEvent) => void }) {
    return (
        <Dropdown.Content 
            align={align}
            className="bg-white p-1 rounded-xl flex flex-col shadow-outset min-w-56 z-20"
            onKeyDown={onKeyDown}
        >
            {children}
        </Dropdown.Content>
    )
}

export function DropdownItem({ onSelect, isSelected, icon, text, shortcut }: { onSelect: () => void, isSelected?: boolean, icon?: React.ReactNode, text: string, shortcut?: string }) {
    return (
        <Dropdown.Item 
            onSelect={onSelect}
            className="flex items-center gap-3 p-3 focus:bg-neutral-100 outline-none rounded-lg cursor-pointer"
        >
            { icon && <div className="flex-shrink-0">{icon}</div> }
            <div className="flex-grow flex gap-1 items-center">                
                <span className="flex-grow">{text}</span>
                {isSelected && <Check/>}
            </div>
            { shortcut &&
                <span className="text-neutral-500">{shortcut}</span>
            }
        </Dropdown.Item>
    )
}
import { Button } from "@/components/base/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/base/command";
import { Label } from "@/components/base/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { ChevronsUpDown } from "@mynaui/icons-react";

export default function Basic() {
  return (
    <div className="w-full space-y-1 md:w-72">
      <Label htmlFor="tag">Tag</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Select Tag
            <ChevronsUpDown
              className="size-4 shrink-0 text-muted-foreground"
              stroke={2}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." autoFocus />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                <CommandItem>Work</CommandItem>
                <CommandItem>Personal</CommandItem>
                <CommandItem>Travel</CommandItem>
                <CommandItem>Shopping</CommandItem>
                <CommandItem>Recipes</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

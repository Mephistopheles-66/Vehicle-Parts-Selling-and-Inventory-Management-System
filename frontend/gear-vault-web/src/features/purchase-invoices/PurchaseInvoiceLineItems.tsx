import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'
import type { Part } from '../../types/part'

export interface LineItemInput {
  partId: string
  quantity: number
  unitPrice: number
}

interface PurchaseInvoiceLineItemsProps {
  parts: Part[]
  value: LineItemInput[]
  onChange: (items: LineItemInput[]) => void
}

const formatNPR = (value: number) =>
  `NPR ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`

export default function PurchaseInvoiceLineItems({
  parts,
  value,
  onChange,
}: PurchaseInvoiceLineItemsProps) {
  const [openPopover, setOpenPopover] = useState<number | null>(null)

  const updateItem = (index: number, updates: Partial<LineItemInput>) => {
    const newItems = value.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    )
    onChange(newItems)
  }

  const handlePartSelect = (index: number, partId: string) => {
    updateItem(index, {
      partId,
      unitPrice: 0,
    })
    setOpenPopover(null)
  }

  const addRow = () => {
    onChange([...value, { partId: '', quantity: 1, unitPrice: 0 }])
  }

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const subtotal = value.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Part</TableHead>
              <TableHead className="w-[120px]">Quantity</TableHead>
              <TableHead className="w-[160px]">Unit Price (NPR)</TableHead>
              <TableHead className="w-[160px] text-right">Total (NPR)</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.map((item, index) => {
              const selectedPart = parts.find((p) => p.id === item.partId)
              const total = item.quantity * item.unitPrice

              return (
                <TableRow key={index}>
                  <TableCell>
                    <Popover
                      open={openPopover === index}
                      onOpenChange={(open) =>
                        setOpenPopover(open ? index : null)
                      }
                    >
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between font-normal"
                          />
                        }
                      >
                          {selectedPart ? (
                            <span>
                              <span className="font-mono">
                                {selectedPart.partNumber}
                              </span>{' '}
                              — {selectedPart.name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Select part...
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent className="w-[350px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search parts..." />
                          <CommandList>
                            <CommandEmpty>No parts found.</CommandEmpty>
                            <CommandGroup>
                              {parts.map((part) => (
                                <CommandItem
                                  key={part.id}
                                  value={`${part.partNumber} ${part.name}`}
                                  onSelect={() =>
                                    handlePartSelect(index, part.id)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      item.partId === part.id
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  <span className="font-mono mr-2">
                                    {part.partNumber}
                                  </span>
                                  {part.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, {
                          quantity: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, {
                          unitPrice: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNPR(total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={value.length <= 1}
                      onClick={() => removeRow(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-2 h-4 w-4" />
          Add Line Item
        </Button>
        <div className="text-sm font-medium">
          Subtotal: <span className="text-lg">{formatNPR(subtotal)}</span>
        </div>
      </div>
    </div>
  )
}

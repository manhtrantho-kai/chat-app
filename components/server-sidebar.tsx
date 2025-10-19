"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Clan } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateClanDialog } from "@/components/create-clan-dialog"

interface ServerSidebarProps {
  clans: Clan[]
  selectedClanId: string
  onSelectClan: (clanId: string) => void
}

export function ServerSidebar({ clans, selectedClanId, onSelectClan }: ServerSidebarProps) {
  console.log("[v0] ServerSidebar render:", { clansCount: clans.length, selectedClanId })

  return (
    <div className="flex w-[72px] flex-col items-center gap-2 bg-[#1e1f22] py-3">
      <TooltipProvider delayDuration={0}>
        {/* Home/Direct Messages Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-12 w-12 rounded-[24px] bg-[#313338] transition-all hover:rounded-[16px] hover:bg-[#5865f2]",
                selectedClanId === "home" && "rounded-[16px] bg-[#5865f2]",
              )}
              onClick={() => onSelectClan("home")}
            >
              <svg width="28" height="20" viewBox="0 0 28 20" className="fill-current">
                <path d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.8242 0.934541 10.593 0.461744 10.3408 0C8.49133 0.318797 6.68853 0.879656 4.97803 1.67671C0.71443 7.59919 -0.431531 13.3983 0.134851 19.1283C2.18645 20.6552 4.47763 21.8157 6.90707 22.5602C7.43511 21.8013 7.90356 21.0027 8.30736 20.1707C7.53857 19.8818 6.79804 19.5272 6.09448 19.1113C6.27022 18.9844 6.44596 18.8519 6.61537 18.7193C11.5221 20.9845 16.9181 20.9845 21.7677 18.7193C21.9371 18.8519 22.1128 18.9844 22.2886 19.1113C21.585 19.5272 20.8445 19.8818 20.0757 20.1707C20.4795 21.0027 20.9479 21.8013 21.476 22.5602C23.9054 21.8157 26.1966 20.6552 28.2482 19.1283C28.8882 12.5547 27.1725 6.80254 23.0212 1.67671ZM9.68041 15.6964C8.26559 15.6964 7.10416 14.4018 7.10416 12.8281C7.10416 11.2545 8.24042 9.95987 9.68041 9.95987C11.1204 9.95987 12.2817 11.2545 12.2566 12.8281C12.2566 14.4018 11.1204 15.6964 9.68041 15.6964ZM18.3028 15.6964C16.888 15.6964 15.7266 14.4018 15.7266 12.8281C15.7266 11.2545 16.8628 9.95987 18.3028 9.95987C19.7428 9.95987 20.9041 11.2545 20.879 12.8281C20.879 14.4018 19.7428 15.6964 18.3028 15.6964Z" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Direct Messages</p>
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <div className="h-[2px] w-8 rounded-full bg-[#35363c]" />

        {/* Empty State Message */}
        {clans.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-2 py-4">
            <p className="text-center text-xs text-[#b5bac1]">Chưa có server nào</p>
          </div>
        )}

        {/* Server List */}
        {clans.map((clan) => (
          <Tooltip key={clan.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative h-12 w-12 overflow-hidden rounded-[24px] bg-[#313338] p-0 transition-all hover:rounded-[16px] hover:bg-[#5865f2]",
                  selectedClanId === clan.id && "rounded-[16px] bg-[#5865f2]",
                )}
                onClick={() => onSelectClan(clan.id)}
              >
                {selectedClanId === clan.id && (
                  <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                )}
                <Avatar className="h-12 w-12 rounded-[24px] transition-all group-hover:rounded-[16px]">
                  <AvatarImage src={clan.icon || "/placeholder.svg"} alt={clan.name} />
                  <AvatarFallback className="rounded-[24px] bg-[#5865f2] text-white">
                    {clan.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{clan.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Add Server Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <CreateClanDialog onClanCreated={() => window.location.reload()} />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add a Server</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

import { useCallback } from 'react'
import { AppIcon, FileIcon, FolderIcon } from './icons'
import type { FsIcon, FsAction } from '../data/fs'
import { useWindows } from '../store/windows'

export function ItemIcon({ icon, size = 64 }: { icon: FsIcon; size?: number }) {
  if (icon.type === 'folder') return <FolderIcon size={size} glyph={icon.glyph} />
  if (icon.type === 'file') return <FileIcon size={size} kind={icon.kind} thumb={icon.thumb} />
  return <AppIcon kind={icon.kind} size={size} />
}

/** Opens a file-system action from anywhere (desktop, Spotlight, Finder). */
export function useOpenAction() {
  const { open } = useWindows()
  return useCallback((a: FsAction) => {
    if ('folder' in a) open('finder', { path: a.folder })
    else open(a.app, a.params, a.key)
  }, [open])
}

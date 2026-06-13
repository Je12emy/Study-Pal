import { useMutation, useQuery } from "@tanstack/react-query"

import {
  createStudyArea,
  deleteStudyArea,
  listStudyAreas,
  renameStudyArea,
} from "@/services/study-areas"

export const studyAreasQueryKey = ["study-areas"] as const

export function useStudyAreas() {
  const studyAreasQuery = useQuery({
    queryKey: studyAreasQueryKey,
    queryFn: listStudyAreas,
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: createStudyArea,
  })

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      renameStudyArea(id, { name }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudyArea,
  })

  return {
    studyAreasQuery,
    createStudyArea: createMutation.mutateAsync,
    renameStudyArea: renameMutation.mutateAsync,
    deleteStudyArea: deleteMutation.mutateAsync,
    isCreatingStudyArea: createMutation.isPending,
    isRenamingStudyArea: renameMutation.isPending,
    isDeletingStudyArea: deleteMutation.isPending,
  }
}

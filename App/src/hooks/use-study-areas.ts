import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createStudyArea,
  deleteStudyArea,
  listStudyAreas,
  renameStudyArea,
} from "@/services/study-areas"

export const studyAreasQueryKey = ["study-areas"] as const

export function useStudyAreas() {
  const queryClient = useQueryClient()

  const studyAreasQuery = useQuery({
    queryKey: studyAreasQueryKey,
    queryFn: listStudyAreas,
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: createStudyArea,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studyAreasQueryKey })
    },
  })

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      renameStudyArea(id, { name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studyAreasQueryKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudyArea,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studyAreasQueryKey })
    },
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

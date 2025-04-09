import { useToast } from "@/hooks/use-toast"
import {useState, useEffect} from 'react'

interface DataProviderProps<T extends Record<string, any>> {
  apiEndpoint: string
  idField: string
  defaultValues: Partial<T>
  children: (props: {
    data: T[]
    loading: boolean
    totalItems: number
    currentPage: number
    setCurrentPage: (page: number) => void
    pageSize: number
    setPageSize: (size: number) => void
    searchTerm: string
    setSearchTerm: (term: string) => void
    filterActive: string | null
    setFilterActive: (active: string | null) => void
    selectedItems: string[]
    setSelectedItems: (items: string[]) => void
    selectAll: boolean
    setSelectAll: (selectAll: boolean) => void
    handleSelectAll: () => void
    handleSelectItem: (id: string) => void
    handleRefresh: () => void
    handleNew: () => void
    handleEdit: () => void
    handleDelete: () => void
    handleSaveItem: (data: any) => Promise<void>
    confirmDelete: () => Promise<void>
    editDialogOpen: boolean
    setEditDialogOpen: (open: boolean) => void
    confirmDialogOpen: boolean
    setConfirmDialogOpen: (open: boolean) => void
    loadData: () => void
  }) => React.ReactNode
}

export function DataProvider<T extends Record<string, any>>({ 
  apiEndpoint, 
  idField, 
  defaultValues,
  children 
}: DataProviderProps<T>) {
  const { toast } = useToast()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // Función para cargar los datos desde la API
  const loadData = async () => {
    setLoading(true)
    try {
      const skip = (currentPage - 1) * pageSize
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
      const activeParam = filterActive !== null ? `&active=${filterActive}` : ''
      
      const url = `/api/tablas/${apiEndpoint}?take=${pageSize}&skip=${skip}${searchParam}${activeParam}`
      console.log('Fetching data from:', url)
      
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error response from ${url}:`, errorText)
        throw new Error(`Error al cargar ${apiEndpoint}: ${response.status} ${response.statusText}`)
      }
      const responseData = await response.json()
      setData(responseData)
      
      // Obtener el conteo total para la paginación
      try {
        const countUrl = `/api/tablas/${apiEndpoint}/count${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}${activeParam}`
        console.log('Fetching count from:', countUrl)
        
        const countResponse = await fetch(countUrl)
        if (!countResponse.ok) {
          const errorText = await countResponse.text()
          console.error('Error en la respuesta del conteo:', errorText)
          // No lanzar error, usar la longitud de los datos como fallback
          setTotalItems(responseData.length)
        } else {
          const { count } = await countResponse.json()
          setTotalItems(count)
        }
      } catch (countError) {
        console.error('Error al obtener el conteo:', countError)
        setTotalItems(responseData.length)
      }
    } catch (error) {
      console.error(`Error loading ${apiEndpoint}:`, error)
      toast({
        title: "Error",
        description: `Error al cargar los datos de ${apiEndpoint}`,
        variant: "destructive"
      })
      setData([])
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al iniciar y cuando cambien los filtros
  useEffect(() => {
    loadData()
  }, [currentPage, pageSize])

  // Manejar búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1) // Resetear a la primera página al buscar
      loadData()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchTerm, filterActive])

  // Manejar selección de todos los items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(data.map((item: T) => item[idField] as string))
    }
    setSelectAll(!selectAll)
  }

  // Manejar selección individual
  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      setSelectAll(false)
    } else {
      setSelectedItems([...selectedItems, id])
      if (selectedItems.length + 1 === data.length) {
        setSelectAll(true)
      }
    }
  }

  const handleRefresh = () => {
    setSearchTerm("")
    setSelectedItems([])
    setSelectAll(false)
    setCurrentPage(1)
    setFilterActive(null)
    loadData()
    toast({
      title: "Actualizado",
      description: "La lista ha sido actualizada",
    })
  }

  const handleNew = () => {
    setEditDialogOpen(true)
  }

  const handleEdit = () => {
    if (selectedItems.length !== 1) return

    const itemToEdit = data.find((item: T) => item[idField] === selectedItems[0])
    if (itemToEdit) {
      setEditDialogOpen(true)
    }
  }

  const handleDelete = () => {
    if (selectedItems.length === 0) return
    setConfirmDialogOpen(true)
  }

  const handleSaveItem = async (formData: any) => {
    try {
      const response = await fetch(`/api/tablas/${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `Error al crear ${apiEndpoint}`)
      }
      
      toast({
        title: "Creado",
        description: `El registro ha sido creado correctamente`,
      })
      
      // Recargar datos después de guardar
      loadData()
      setEditDialogOpen(false)
    } catch (error) {
      console.error(`Error saving ${apiEndpoint}:`, error)
      toast({
        title: "Error",
        description: `Error al guardar el registro`,
        variant: "destructive"
      })
    }
  }

  const confirmDelete = async () => {
    try {
      const deletePromises = selectedItems.map(async id => {
        const response = await fetch(`/api/tablas/${apiEndpoint}/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || `Error al eliminar ${apiEndpoint}`)
        }
      })
      
      await Promise.all(deletePromises)
      
      toast({
        title: "Eliminado",
        description: `Se han eliminado ${selectedItems.length} registros correctamente`,
      })
      
      // Recargar datos después de eliminar
      loadData()
      setSelectedItems([])
      setSelectAll(false)
      setConfirmDialogOpen(false)
    } catch (error) {
      console.error(`Error deleting ${apiEndpoint}:`, error)
      toast({
        title: "Error",
        description: "Error al eliminar los registros",
        variant: "destructive"
      })
    }
  }

  return children({
    data,
    loading,
    totalItems,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
    filterActive,
    setFilterActive,
    selectedItems,
    setSelectedItems,
    selectAll,
    setSelectAll,
    handleSelectAll,
    handleSelectItem,
    handleRefresh,
    handleNew,
    handleEdit,
    handleDelete,
    handleSaveItem,
    confirmDelete,
    editDialogOpen,
    setEditDialogOpen,
    confirmDialogOpen,
    setConfirmDialogOpen,
    loadData
  })
}

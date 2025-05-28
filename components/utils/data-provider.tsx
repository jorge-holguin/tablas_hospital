import { useToast } from "@/hooks/use-toast"
import {useState, useEffect} from 'react'

interface DataProviderProps<T extends Record<string, any>> {
  apiEndpoint: string
  idField: string
  defaultValues: Partial<T>
  extraParams?: Record<string, any>
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
  extraParams = {},
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
      
      // Añadir extraParams a la URL
      let extraParamsString = ''
      if (extraParams) {
        Object.entries(extraParams).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            extraParamsString += `&${key}=${encodeURIComponent(String(value))}`
          }
        })
      }
      
      const url = `/api/tablas/${apiEndpoint}?take=${pageSize}&skip=${skip}${searchParam}${activeParam}${extraParamsString}`
      console.log('Fetching data from:', url)
      
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error response from ${url}:`, errorText)
        throw new Error(`Error al cargar ${apiEndpoint}: ${response.status} ${response.statusText}`)
      }
      
      // Check content type to avoid JSON parsing errors
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text()
        console.error(`Received non-JSON response from ${url}:`, responseText)
        throw new Error(`Error: La respuesta del servidor no es JSON válido (${contentType})`)
      }
      
      const responseJson = await response.json()
      
      // Verificar si la respuesta tiene el nuevo formato (data + meta) o el formato antiguo
      if (responseJson.data && responseJson.meta) {
        // Nuevo formato con metadatos
        setData(responseJson.data)
        setTotalItems(responseJson.meta.total)
        console.log(`Datos cargados: ${responseJson.data.length}, Total: ${responseJson.meta.total}`)
      } else {
        // Formato antiguo (array directo)
        setData(responseJson)
        
        // Obtener el conteo total para la paginación
        try {
          // Añadir extraParams a la URL de conteo
          let extraParamsCountString = ''
          if (extraParams) {
            Object.entries(extraParams).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                extraParamsCountString += `&${key}=${encodeURIComponent(String(value))}`
              }
            })
          }
          
          const countUrl = `/api/tablas/${apiEndpoint}/count${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '?'}${!searchTerm ? '' : '&'}${activeParam ? activeParam.substring(1) : ''}${extraParamsCountString}`
          console.log('Fetching count from:', countUrl)
          
          const countResponse = await fetch(countUrl)
          if (!countResponse.ok) {
            console.error('Error en la respuesta del conteo:', countResponse.status, countResponse.statusText)
            // No lanzar error, usar la longitud de los datos como fallback
            setTotalItems(responseJson.length)
          } else {
            try {
              const countData = await countResponse.json()
              // Manejar diferentes formatos de respuesta
              if (typeof countData === 'number') {
                // Si la respuesta es directamente un número
                console.log('Respuesta de conteo recibida como número:', countData)
                setTotalItems(countData)
              } else if (countData && typeof countData.count === 'number') {
                // Si la respuesta tiene una propiedad count
                console.log('Respuesta de conteo recibida con propiedad count:', countData.count)
                setTotalItems(countData.count)
              } else if (countData && typeof countData.total === 'number') {
                // Si la respuesta tiene una propiedad total
                console.log('Respuesta de conteo recibida con propiedad total:', countData.total)
                setTotalItems(countData.total)
              } else {
                // Si no podemos determinar el conteo, usar la longitud de los datos
                console.warn('Formato de respuesta de conteo desconocido:', countData)
                setTotalItems(responseJson.length)
              }
            } catch (parseError) {
              console.error('Error al parsear la respuesta del conteo:', parseError)
              setTotalItems(responseJson.length)
            }
          }
        } catch (countError) {
          console.error('Error al obtener el conteo:', countError)
          setTotalItems(responseJson.length)
        }
      }
    } catch (error) {
      console.error(`Error loading ${apiEndpoint}:`, error)
      toast({
        title: "Error",
        description: `Error al cargar los datos de ${apiEndpoint}`,
        variant: "destructive"
      })
      setData([])
      setTotalItems(0)
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

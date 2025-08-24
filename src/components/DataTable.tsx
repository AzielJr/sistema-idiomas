import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TableSortLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material';

interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  searchable?: boolean;
  selectable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  sx?: any;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  title,
  onEdit,
  onDelete,
  onView,
  onSelectionChange,
  searchable = true,
  selectable = false,
  loading = false,
  emptyMessage = 'Nenhum dado encontrado',
  sx
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  // Filtragem dos dados
  const filteredData = useMemo(() => {
    let filtered = data;

    // Aplicar busca
    if (searchTerm && searchable) {
      const searchableColumns = columns.filter(col => col.searchable !== false);
      filtered = data.filter(item =>
        searchableColumns.some(col => {
          const value = item[col.id];
          if (value == null) return false;
          return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Aplicar ordenação
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return order === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, orderBy, order, columns, searchable]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (columnId: keyof T) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(paginatedData);
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedItems([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (item: T) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    let newSelectedItems: T[];

    if (isSelected) {
      newSelectedItems = selectedItems.filter(selected => selected.id !== item.id);
    } else {
      newSelectedItems = [...selectedItems, item];
    }

    setSelectedItems(newSelectedItems);
    onSelectionChange?.(newSelectedItems);
  };

  const isSelected = (item: T) => selectedItems.some(selected => selected.id === item.id);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        {title && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            {title}
          </Typography>
        )}
        
        {/* Barra de busca */}
        {searchable && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <TextField
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 300 }}
            />
          </Box>
        )}
      </Box>

      {/* Tabela */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selectedItems.length === paginatedData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              
              {(onEdit || onDelete || onView) && (
                <TableCell align="center" style={{ minWidth: 120 }}>
                  Ações
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete || onView ? 1 : 0)}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Typography>Carregando...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete || onView ? 1 : 0)}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isItemSelected = isSelected(row);
                
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id || Math.random()}
                    selected={isItemSelected}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleSelectItem(row)}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={String(column.id)} align={column.align}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                    
                    {(onEdit || onDelete || onView) && (
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {onView && (
                            <Tooltip title="Visualizar">
                              <IconButton
                                size="small"
                                onClick={() => onView(row)}
                                color="primary"
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {onEdit && (
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={() => onEdit(row)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {onDelete && (
                            <Tooltip title="Excluir">
                              <IconButton
                                size="small"
                                onClick={() => onDelete(row)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Paginação */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
      />
    </Paper>
  );
}

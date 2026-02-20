// src/components/goals/GoalFilters.jsx
import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
    Menu,
    MenuItem,
} from '@mui/material';
import { Sort as SortIcon, Search as SearchIcon } from '@mui/icons-material';

export default function GoalFilters({
    statusFilter,
    onStatusChange,
    searchQuery,
    onSearchChange,
    sortOption,
    onSortChange
}) {
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const open = Boolean(sortAnchorEl);

    const handleSortClick = (event) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setSortAnchorEl(null);
    };

    const handleSortSelect = (option) => {
        onSortChange(option);
        handleSortClose();
    };

    return (
        <Box sx={{ mb: 4 }}>
            {/* جستجو */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <TextField
                    placeholder="Search goals..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    size="small"
                    sx={{
                        width: '100%',
                        maxWidth: '500px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: '#f8faf9'
                        }
                    }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: '#666', mr: 1 }} />,
                    }}
                />
            </Box>

            {/* فیلتر وضعیت */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={(e, value) => value && onStatusChange(value)}
                    sx={{
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                >
                    {['all', 'active', 'completed', 'paused'].map((filter) => (
                        <ToggleButton
                            key={filter}
                            value={filter}
                            sx={{
                                textTransform: 'capitalize',
                                px: 2,
                                borderRadius: '12px',
                                color: statusFilter === filter ? '#054532' : '#666',
                                bgcolor: statusFilter === filter ? '#e8f5e9' : 'transparent',
                                '&:hover': {
                                    bgcolor: statusFilter === filter ? '#e8f5e9' : '#f0f0f0',
                                }
                            }}
                        >
                            {filter}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            {/* مرتب‌سازی */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={handleSortClick}
                    sx={{
                        borderColor: '#054532',
                        color: '#054532',
                        borderRadius: '12px',
                        textTransform: 'none',
                        px: 2
                    }}
                >
                    Sort by: {sortOption === 'progress' ? 'Progress' : sortOption === 'newest' ? 'Newest' : 'Category'}
                </Button>
            </Box>

            {/* منوی مرتب‌سازی (ساده‌شده) */}
            <Menu
                anchorEl={sortAnchorEl}
                open={open}
                onClose={handleSortClose}
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        minWidth: '150px'
                    }
                }}
            >
                {[
                    { value: 'progress', label: 'Progress' },
                    { value: 'newest', label: 'Newest' },
                    { value: 'category', label: 'Category' }
                ].map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={() => handleSortSelect(option.value)}
                        sx={{
                            fontSize: '0.9rem',
                            py: 1.2
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
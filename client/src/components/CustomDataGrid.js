import React, { useState, useEffect } from 'react';

const initialData = [
  { id: 1, name: 'John', age: 25, city: 'New York' },
  { id: 2, name: 'Alice', age: 30, city: 'San Francisco' },
  // Add more data...
];

const DataGrid = () => {
  const [data, setData] = useState(initialData);
  const [columns, setColumns] = useState(['name', 'age', 'city']);
  const [filter, setFilter] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Apply filters and sorting when data, columns, or filter state change
  useEffect(() => {
    let filteredData = initialData;

    if (Object.keys(filter).length > 0) {
      filteredData = filteredData.filter((item) =>
        Object.entries(filter).every(([key, value]) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if (sortKey) {
      filteredData = filteredData.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    setData(filteredData);
  }, [filter, sortKey, sortOrder]);

  // Handle column visibility
  const toggleColumn = (column) => {
    if (columns.includes(column)) {
      setColumns(columns.filter((col) => col !== column));
    } else {
      setColumns([...columns, column]);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination calculation
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {col}
                <button
                  onClick={() => toggleColumn(col)}
                  className="btn btn-sm btn-secondary ml-2"
                >
                  {columns.includes(col) ? 'Hide' : 'Show'}
                </button>
              </th>
            ))}
          </tr>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                <input
                  type="text"
                  placeholder={`Filter ${col}`}
                  value={filter[col] || ''}
                  onChange={(e) =>
                    setFilter({ ...filter, [col]: e.target.value })
                  }
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col}>{item[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={endIndex >= data.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataGrid;

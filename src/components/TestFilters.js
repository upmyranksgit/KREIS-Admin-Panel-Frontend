import React from 'react';
import { Row, Col, Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { InstituteSelect, BranchSelect, BatchSelect } from './dropdowns';

const { Search } = Input;

const TestFilters = ({
    onSearch,
    onFilterChange,
    onReset,
    showCategory = true,
    showInstitute = true,
    showBranch = true,
    showBatch = true,
    categories = [],
    selectedInstitute = null,
    selectedBranch = null,
    selectedBatches = [],
    loading = false
}) => {
    return (
        <div style={{ marginBottom: 16, padding: 16, background: '#fafafa', borderRadius: 4 }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Search
                        placeholder="Search by test name"
                        allowClear
                        onSearch={onSearch}
                        style={{ width: '100%' }}
                        prefix={<SearchOutlined />}
                    />
                </Col>

                {showCategory && (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Select Category"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={(value) => onFilterChange('category', value)}
                            loading={loading}
                        >
                            {categories.map(cat => (
                                <Select.Option key={cat.value} value={cat.value}>{cat.label}</Select.Option>
                            ))}
                        </Select>
                    </Col>
                )}

                {showInstitute && (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <InstituteSelect
                            value={selectedInstitute}
                            onChange={(value) => onFilterChange('institute', value)}
                        />
                    </Col>
                )}

                {showBranch && (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <BranchSelect
                            value={selectedBranch}
                            onChange={(value) => onFilterChange('branch', value)}
                            instituteId={selectedInstitute}
                        />
                    </Col>
                )}

                {showBatch && (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <BatchSelect
                            value={selectedBatches}
                            onChange={(value) => onFilterChange('batches', value)}
                            instituteId={selectedInstitute}
                            branchId={selectedBranch}
                        />
                    </Col>
                )}

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Button icon={<ReloadOutlined />} onClick={onReset}>
                        Reset Filters
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default TestFilters;

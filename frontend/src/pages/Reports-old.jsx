import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import reportService from '../services/reportService';
import './Reports.css';

const Reports = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('create'); // create, daily, history
    
    // Form state for hourly report
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: `${new Date().getHours().toString().padStart(2, '0')}:00`,
        description: { generated: 0, added: 0 },
        faq: { generated: 0, added: 0 },
        keywords: { generated: 0, added: 0 },
        specifications: { generated: 0, added: 0 },
        metaTitleDescription: { generated: 0, added: 0 },
        titleFixed: { fixed: 0, added: 0 },
        imageRenamed: { fixed: 0 },
        category: { added: 0 },
        attributes: { added: 0 },
        deliveryCharge: { added: 0 },
        warranty: { added: 0 },
        warrantyClaimReasons: { added: 0 },
        brand: { added: 0 },
        price: { added: 0 },
        customFields: []
    });
    
    // Daily report state
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailyReport, setDailyReport] = useState(null);
    
    // History state
    const [hourlyReports, setHourlyReports] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    
    // Edit mode
    const [editingReport, setEditingReport] = useState(null);
    
    // Custom field input
    const [customFieldName, setCustomFieldName] = useState('');
    const [customFieldValue, setCustomFieldValue] = useState(0);

    // Handle input change for nested fields
    const handleFieldChange = (field, subField, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [subField]: parseInt(value) || 0
            }
        }));
    };

    // Add custom field
    const addCustomField = () => {
        if (!customFieldName.trim()) {
            toast.error('Please enter a field name');
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            customFields: [...prev.customFields, { name: customFieldName, value: parseInt(customFieldValue) || 0 }]
        }));
        
        setCustomFieldName('');
        setCustomFieldValue(0);
        toast.success('Custom field added');
    };

    // Remove custom field
    const removeCustomField = (index) => {
        setFormData(prev => ({
            ...prev,
            customFields: prev.customFields.filter((_, i) => i !== index)
        }));
    };

    // Submit hourly report
    const handleSubmitHourlyReport = async (e) => {
        e.preventDefault();
        
        try {
            const reportData = {
                date: formData.date,
                time: formData.time,
                data: {
                    description: formData.description,
                    faq: formData.faq,
                    keywords: formData.keywords,
                    specifications: formData.specifications,
                    metaTitleDescription: formData.metaTitleDescription,
                    titleFixed: formData.titleFixed,
                    imageRenamed: formData.imageRenamed,
                    category: formData.category,
                    attributes: formData.attributes,
                    deliveryCharge: formData.deliveryCharge,
                    warranty: formData.warranty,
                    warrantyClaimReasons: formData.warrantyClaimReasons,
                    brand: formData.brand,
                    price: formData.price,
                    customFields: formData.customFields
                }
            };
            
            if (editingReport) {
                await reportService.updateHourlyReport(editingReport.id, reportData);
                toast.success('Report updated successfully!');
                setEditingReport(null);
            } else {
                await reportService.createHourlyReport(reportData);
                toast.success('Hourly report created successfully!');
            }
            
            // Reset form
            resetForm();
            
            // Refresh history if on that tab
            if (activeTab === 'history') {
                fetchHourlyReports();
            }
        } catch (error) {
            console.error('Error saving report:', error);
            toast.error(error.response?.data?.message || 'Failed to save report');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            time: `${new Date().getHours().toString().padStart(2, '0')}:00`,
            description: { generated: 0, added: 0 },
            faq: { generated: 0, added: 0 },
            keywords: { generated: 0, added: 0 },
            specifications: { generated: 0, added: 0 },
            metaTitleDescription: { generated: 0, added: 0 },
            titleFixed: { fixed: 0, added: 0 },
            imageRenamed: { fixed: 0 },
            category: { added: 0 },
            attributes: { added: 0 },
            deliveryCharge: { added: 0 },
            warranty: { added: 0 },
            warrantyClaimReasons: { added: 0 },
            brand: { added: 0 },
            price: { added: 0 },
            customFields: []
        });
    };

    // Fetch daily report
    const fetchDailyReport = async () => {
        try {
            const response = await reportService.getDailyReport(selectedDate);
            setDailyReport(response.report);
        } catch (error) {
            console.error('Error fetching daily report:', error);
            if (error.response?.status === 404) {
                setDailyReport(null);
                toast.error('No reports found for this date');
            } else {
                toast.error('Failed to fetch daily report');
            }
        }
    };

    // Fetch hourly reports
    const fetchHourlyReports = async () => {
        try {
            const filters = {};
            if (filterStartDate) filters.startDate = filterStartDate;
            if (filterEndDate) filters.endDate = filterEndDate;
            
            const response = await reportService.getHourlyReports(filters);
            setHourlyReports(response.reports);
        } catch (error) {
            console.error('Error fetching hourly reports:', error);
            toast.error('Failed to fetch reports');
        }
    };

    // Delete hourly report
    const handleDeleteReport = async (id) => {
        if (!confirm('Are you sure you want to delete this report?')) return;
        
        try {
            await reportService.deleteHourlyReport(id);
            toast.success('Report deleted successfully');
            fetchHourlyReports();
        } catch (error) {
            console.error('Error deleting report:', error);
            toast.error('Failed to delete report');
        }
    };

    // Edit report
    const handleEditReport = (report) => {
        setEditingReport(report);
        setFormData({
            date: report.date,
            time: report.time,
            ...report.data
        });
        setActiveTab('create');
    };

    // Copy to clipboard with WhatsApp format
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy to clipboard');
        });
    };

    // Load daily report when date changes
    useEffect(() => {
        if (activeTab === 'daily') {
            fetchDailyReport();
        }
    }, [selectedDate, activeTab]);

    // Load hourly reports when history tab is active
    useEffect(() => {
        if (activeTab === 'history') {
            fetchHourlyReports();
        }
    }, [activeTab, filterStartDate, filterEndDate]);

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h1>Updates & Reports</h1>
                <button onClick={() => navigate('/')} className="btn-back">
                    ← Back to Home
                </button>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    {editingReport ? 'Edit Report' : 'Create Hourly Report'}
                </button>
                <button 
                    className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
                    onClick={() => setActiveTab('daily')}
                >
                    Daily Report
                </button>
                <button 
                    className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Report History
                </button>
            </div>

            {/* Create/Edit Hourly Report Tab */}
            {activeTab === 'create' && (
                <div className="tab-content">
                    <form onSubmit={handleSubmitHourlyReport} className="report-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date</label>
                                <input 
                                    type="date" 
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Time</label>
                                <input 
                                    type="time" 
                                    value={formData.time}
                                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <h3>Product Work</h3>
                        
                        {/* Description */}
                        <div className="field-group">
                            <label className="field-label">Description</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Generated"
                                    value={formData.description.generated}
                                    onChange={(e) => handleFieldChange('description', 'generated', e.target.value)}
                                    min="0"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.description.added}
                                    onChange={(e) => handleFieldChange('description', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="field-group">
                            <label className="field-label">FAQ</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Generated"
                                    value={formData.faq.generated}
                                    onChange={(e) => handleFieldChange('faq', 'generated', e.target.value)}
                                    min="0"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.faq.added}
                                    onChange={(e) => handleFieldChange('faq', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="field-group">
                            <label className="field-label">Keywords</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Generated"
                                    value={formData.keywords.generated}
                                    onChange={(e) => handleFieldChange('keywords', 'generated', e.target.value)}
                                    min="0"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.keywords.added}
                                    onChange={(e) => handleFieldChange('keywords', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="field-group">
                            <label className="field-label">Specifications</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Generated"
                                    value={formData.specifications.generated}
                                    onChange={(e) => handleFieldChange('specifications', 'generated', e.target.value)}
                                    min="0"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.specifications.added}
                                    onChange={(e) => handleFieldChange('specifications', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Meta Title & Description */}
                        <div className="field-group">
                            <label className="field-label">Meta Title & Description</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Generated"
                                    value={formData.metaTitleDescription.generated}
                                    onChange={(e) => handleFieldChange('metaTitleDescription', 'generated', e.target.value)}
                                    min="0"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.metaTitleDescription.added}
                                    onChange={(e) => handleFieldChange('metaTitleDescription', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Title Fixed */}
                        <div className="field-group">
                            <label className="field-label">Title</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Fixed"
                                    value={formData.titleFixed.fixed}
                                    onChange={(e) => handleFieldChange('titleFixed', 'fixed', e.target.value)}
                                    min="0"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.titleFixed.added}
                                    onChange={(e) => handleFieldChange('titleFixed', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Image Renamed */}
                        <div className="field-group">
                            <label className="field-label">Image Renamed & Fixed</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Fixed"
                                    value={formData.imageRenamed.fixed}
                                    onChange={(e) => handleFieldChange('imageRenamed', 'fixed', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="field-group">
                            <label className="field-label">Category</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.category.added}
                                    onChange={(e) => handleFieldChange('category', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Attributes */}
                        <div className="field-group">
                            <label className="field-label">Attributes</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.attributes.added}
                                    onChange={(e) => handleFieldChange('attributes', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Delivery Charge */}
                        <div className="field-group">
                            <label className="field-label">Delivery Charge</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.deliveryCharge.added}
                                    onChange={(e) => handleFieldChange('deliveryCharge', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Warranty */}
                        <div className="field-group">
                            <label className="field-label">Warranty</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.warranty.added}
                                    onChange={(e) => handleFieldChange('warranty', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Warranty Claim Reasons */}
                        <div className="field-group">
                            <label className="field-label">Warranty Claim Reasons</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.warrantyClaimReasons.added}
                                    onChange={(e) => handleFieldChange('warrantyClaimReasons', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="field-group">
                            <label className="field-label">Brand</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.brand.added}
                                    onChange={(e) => handleFieldChange('brand', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="field-group">
                            <label className="field-label">Price</label>
                            <div className="field-inputs">
                                <input 
                                    type="number" 
                                    placeholder="Added"
                                    value={formData.price.added}
                                    onChange={(e) => handleFieldChange('price', 'added', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Custom Fields */}
                        <h3>Custom Fields</h3>
                        <div className="custom-fields-section">
                            <div className="custom-field-input">
                                <input 
                                    type="text" 
                                    placeholder="Field name"
                                    value={customFieldName}
                                    onChange={(e) => setCustomFieldName(e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    placeholder="Value"
                                    value={customFieldValue}
                                    onChange={(e) => setCustomFieldValue(e.target.value)}
                                    min="0"
                                />
                                <button type="button" onClick={addCustomField} className="btn-add">
                                    Add Field
                                </button>
                            </div>
                            
                            {formData.customFields.length > 0 && (
                                <div className="custom-fields-list">
                                    {formData.customFields.map((field, index) => (
                                        <div key={index} className="custom-field-item">
                                            <span>{field.name}: {field.value}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => removeCustomField(index)}
                                                className="btn-remove"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            {editingReport && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditingReport(null);
                                        resetForm();
                                    }}
                                    className="btn-cancel"
                                >
                                    Cancel Edit
                                </button>
                            )}
                            <button type="submit" className="btn-submit">
                                {editingReport ? 'Update Report' : 'Create Report'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Daily Report Tab */}
            {activeTab === 'daily' && (
                <div className="tab-content">
                    <div className="daily-report-controls">
                        <div className="form-group">
                            <label>Select Date</label>
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <button onClick={fetchDailyReport} className="btn-refresh">
                            Refresh
                        </button>
                    </div>

                    {dailyReport ? (
                        <div className="daily-report-view">
                            <div className="report-header">
                                <h3>Daily Report - {dailyReport.date}</h3>
                                <p className="report-meta">
                                    Based on {dailyReport.hourlyReportsCount} hourly report(s)
                                </p>
                            </div>
                            
                            <div className="report-content">
                                <pre>{dailyReport.formattedText}</pre>
                            </div>
                            
                            <button 
                                onClick={() => copyToClipboard(dailyReport.formattedText)}
                                className="btn-copy"
                            >
                                📋 Copy for WhatsApp
                            </button>
                        </div>
                    ) : (
                        <div className="no-data">
                            <p>No reports found for {selectedDate}</p>
                            <p>Create hourly reports to generate daily summaries</p>
                        </div>
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="tab-content">
                    <div className="history-filters">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input 
                                type="date" 
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input 
                                type="date" 
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                            />
                        </div>
                        <button onClick={fetchHourlyReports} className="btn-filter">
                            Apply Filter
                        </button>
                        <button 
                            onClick={() => {
                                setFilterStartDate('');
                                setFilterEndDate('');
                            }}
                            className="btn-clear"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="reports-list">
                        {hourlyReports.length > 0 ? (
                            hourlyReports.map(report => (
                                <div key={report.id} className="report-card">
                                    <div className="report-card-header">
                                        <h4>{report.date} at {report.time}</h4>
                                        <div className="report-actions">
                                            <button 
                                                onClick={() => handleEditReport(report)}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteReport(report.id)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="report-card-summary">
                                        {Object.entries(report.data).map(([key, value]) => {
                                            if (key === 'customFields') {
                                                return value.length > 0 ? (
                                                    <div key={key}>
                                                        <strong>Custom:</strong> {value.map(f => `${f.name} (${f.value})`).join(', ')}
                                                    </div>
                                                ) : null;
                                            }
                                            const total = Object.values(value).reduce((a, b) => a + b, 0);
                                            return total > 0 ? (
                                                <span key={key} className="report-stat">
                                                    {key}: {total}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">
                                <p>No hourly reports found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;

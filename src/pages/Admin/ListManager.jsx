import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../api';

// A highly generic List Manager for Education, Skills, Projects, Services, Testimonials, Hobbies, Certs
const ListManager = ({ title, endpoint, fields, itemRenderer }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    const fetchItems = async () => {
        try {
            const data = await apiFetch(`/api/${endpoint}`, { method: 'GET' });
            setItems(data);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenEdit = (item = null) => {
        if (item) {
            setFormData(item);
        } else {
            // New item
            const newForm = {};
            fields.forEach(f => {
                newForm[f.name] = f.type === 'number' ? 0 : f.type === 'boolean' ? false : '';
            });
            setFormData(newForm);
        }
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (formData.id) {
                // Update
                await apiFetch(`/api/admin/${endpoint}/${formData.id}`, { method: 'PUT', body: formData });
                toast.success('Updated successfully');
            } else {
                // Create
                await apiFetch(`/api/admin/${endpoint}`, { method: 'POST', body: formData });
                toast.success('Added successfully');
            }
            setIsEditing(false);
            fetchItems();
        } catch (err) {
            toast.error(err.message || 'Action failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await apiFetch(`/api/admin/${endpoint}/${id}`, { method: 'DELETE' });
            setItems(items.filter(item => item.id !== id));
            toast.success('Deleted successfully');
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    // Very basic up/down ordering for simplicity
    const handleMove = async (index, direction) => {
        if (direction === -1 && index === 0) return;
        if (direction === 1 && index === items.length - 1) return;

        const newItems = [...items];
        const temp = newItems[index];
        newItems[index] = newItems[index + direction];
        newItems[index + direction] = temp;
        
        setItems(newItems);

        // Save order logic - update order_index for all
        try {
            await Promise.all(newItems.map((item, idx) => 
                apiFetch(`/api/admin/${endpoint}/${item.id}`, { method: 'PUT', body: { ...item, order_index: idx } })
            ));
            toast.success('Order saved');
        } catch (err) {
            toast.error('Failed to save order');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="list-manager-header">
                <h1 className="admin-page-title" style={{margin: 0}}>{title}</h1>
                <button className="btn btn-primary" onClick={() => handleOpenEdit()}>
                    <i className="fa-solid fa-plus"></i> Add New
                </button>
            </div>

            {isEditing && (
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--secondary-color)' }}>
                    <h3>{formData.id ? 'Edit Item' : 'Add New Item'}</h3>
                    <form onSubmit={handleSave} style={{ marginTop: '1.5rem' }}>
                        {fields.map(field => (
                            <div className="form-group" key={field.name}>
                                <label>{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea name={field.name} value={formData[field.name]} onChange={handleChange} className="form-control" rows="3" required={field.required}></textarea>
                                ) : field.type === 'checkbox' ? (
                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <input type="checkbox" name={field.name} checked={!!formData[field.name]} onChange={handleChange} style={{width:'20px', height:'20px'}} />
                                        <span style={{color:'var(--text-secondary)'}}>{field.checkboxLabel || 'Enable'}</span>
                                    </div>
                                ) : (
                                    <input type={field.type || 'text'} name={field.name} value={formData[field.name]} onChange={handleChange} className="form-control" required={field.required} />
                                )}
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="list-container">
                {items.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No items found. Click "Add New" to create one.</p>
                ) : (
                    items.map((item, index) => (
                        <div className="list-item" key={item.id}>
                            <div className="list-item-content">
                                {itemRenderer(item)}
                            </div>
                            <div className="list-item-actions">
                                <button className="btn-icon" onClick={() => handleMove(index, -1)} disabled={index === 0} title="Move Up">
                                    <i className="fa-solid fa-arrow-up"></i>
                                </button>
                                <button className="btn-icon" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1} title="Move Down">
                                    <i className="fa-solid fa-arrow-down"></i>
                                </button>
                                <button className="btn-icon" onClick={() => handleOpenEdit(item)} title="Edit">
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button className="btn-icon delete" onClick={() => handleDelete(item.id)} title="Delete">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListManager;

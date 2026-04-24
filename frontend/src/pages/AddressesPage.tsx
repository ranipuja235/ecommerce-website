import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import type { Address } from '../types';

const AddressesPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing) {
        const { data } = await api.put(`/auth/addresses/${isEditing}`, formData);
        setAddresses(data.addresses);
        if (user) updateUser({ ...user, addresses: data.addresses });
        toast.success('Address updated successfully');
      } else {
        const { data } = await api.post('/auth/addresses', formData);
        setAddresses(data.addresses);
        if (user) updateUser({ ...user, addresses: data.addresses });
        toast.success('Address added successfully');
      }
      
      setIsAdding(false);
      setIsEditing(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setIsEditing(address._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const { data } = await api.delete(`/auth/addresses/${id}`);
      setAddresses(data.addresses);
      if (user) updateUser({ ...user, addresses: data.addresses });
      toast.success('Address deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const address = addresses.find(a => a._id === id);
      if (!address) return;
      
      const { data } = await api.put(`/auth/addresses/${id}`, { ...address, isDefault: true });
      setAddresses(data.addresses);
      if (user) updateUser({ ...user, addresses: data.addresses });
      toast.success('Default address updated');
    } catch (error) {
      toast.error((error as any).response?.data?.message || (error as any).message || 'Failed to set default address');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'Home',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false
    });
  };

  return (
    <div className="bg-cream-white min-h-screen py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-end mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl text-midnight font-medium">Saved Addresses</h1>
          {!isAdding && (
            <button 
              onClick={() => { resetForm(); setIsAdding(true); }}
              className="bg-midnight text-gold px-6 py-2 flex items-center text-sm tracking-wider uppercase hover:bg-black transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add New
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white border border-gray-100 p-6 shadow-sm mb-8 animate-fade-in">
            <h2 className="text-xl font-playfair text-midnight mb-6">{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Address Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-midnight"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-midnight"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  placeholder="House number and street name"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-midnight"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Town / City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-midnight"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-midnight"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-midnight"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-midnight border-gray-300 rounded focus:ring-midnight"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setIsEditing(null); }}
                  className="px-6 py-2 text-gray-500 hover:text-midnight transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-midnight text-gold px-8 py-2 uppercase tracking-widest text-sm hover:bg-black transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(address => (
            <div 
              key={address._id} 
              className={`bg-white border p-6 relative group transition-all duration-300 ${
                address.isDefault ? 'border-midnight shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {address.isDefault && (
                <div className="absolute -top-3 -right-3 bg-gold text-midnight text-xs px-3 py-1 font-bold rounded-full shadow-sm flex items-center">
                  <CheckCircle2 size={12} className="mr-1" /> Default
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center text-midnight font-medium">
                  <MapPin size={18} className="mr-2 text-gray-400" />
                  {address.type}
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-midnight transition-colors rounded-full hover:bg-gray-50"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(address._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="text-gray-600 text-sm space-y-1">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address._id)}
                  className="mt-6 text-xs text-gray-500 hover:text-midnight underline transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
          
          {addresses.length === 0 && !isAdding && (
            <div className="col-span-1 md:col-span-2 bg-white border border-gray-100 p-12 text-center text-gray-500">
              <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg text-midnight mb-2 font-medium">No addresses saved</p>
              <p className="mb-6">Add an address to make your checkout experience faster.</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-midnight text-gold px-8 py-3 uppercase tracking-widest text-sm hover:bg-black transition-colors"
              >
                Add Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;

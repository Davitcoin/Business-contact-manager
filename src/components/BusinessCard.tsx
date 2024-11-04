import React from 'react';
import { MapPin, Phone, Globe, Mail, Star, Clock } from 'lucide-react';
import { Business } from '../types/business';

interface BusinessCardProps {
  business: Business;
  onEdit: (business: Business) => void;
  onDelete: (id: string) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{business.name}</h3>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
            {business.category}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(business)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(business.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{business.address}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          <span>{business.phone}</span>
        </div>
        {business.email && (
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <a
              href={`mailto:${business.email}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {business.email}
            </a>
          </div>
        )}
        {business.website && (
          <div className="flex items-center text-gray-600">
            <Globe className="w-4 h-4 mr-2" />
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {business.website}
            </a>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-gray-700">
            {business.rating} ({business.reviews} reviews)
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center mb-2">
          <Clock className="w-4 h-4 mr-2 text-gray-600" />
          <span className="font-medium text-gray-700">Opening Hours</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          {Object.entries(business.openingHours).map(([day, hours]) => (
            <div key={day} className="flex justify-between">
              <span className="font-medium">{day}:</span>
              <span>{hours}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Last updated: {new Date(business.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );
};
'use client';

import { useEffect, useRef } from 'react';
import type { Map, Marker } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Farmer } from '@/types/farmer';

interface FarmersMapProps {
  farmers: Farmer[];
  onMarkerClick: (farmer: Farmer) => void;
}

export default function FarmersMap({ farmers, onMarkerClick }: FarmersMapProps) {
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize map centered on Mauritania
      mapRef.current = L.map(mapContainerRef.current).setView([20.0, -10.0], 6);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Add a small legend control to explain marker colors
    let legendControl: any = null;
    if (mapRef.current) {
      legendControl = (L.control as any)({ position: 'topright' });
      (legendControl as any).onAdd = function () {
        const div = L.DomUtil.create('div', 'map-legend p-2 text-sm bg-white rounded shadow');
        div.innerHTML = `
          <div class="flex flex-col">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><span style="width:12px;height:12px;background:green;border-radius:50%;display:inline-block;border:2px solid #fff"></span>Produits disponibles</div>
            <div style="display:flex;align-items:center;gap:8px;"><span style="width:12px;height:12px;background:red;border-radius:50%;display:inline-block;border:2px solid #fff"></span>Pas de produits</div>
          </div>
        `;
        return div;
      };
      (legendControl as any).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];

    // Add markers for each farmer
    farmers.forEach((farmer) => {
      // Create custom icon based on product availability
      const iconColor = farmer.hasProducts ? 'green' : 'red';
      const iconHtml = `
        <div style="
          background-color: ${iconColor};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([farmer.lat, farmer.lng], { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>${farmer.name}</strong><br/>
            <span>📍 ${farmer.location}</span><br/>
            <span style="color: ${farmer.hasProducts ? 'green' : 'red'};">
              ${farmer.hasProducts ? '✅ Produits disponibles' : '❌ Pas de produits'}
            </span>
          </div>
        `);

      marker.on('click', () => {
        onMarkerClick(farmer);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (farmers.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(farmers.map(f => [f.lat, f.lng] as [number, number]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        // remove legend control if present
        if (legendControl && mapRef.current) {
          try {
            (legendControl as any).remove();
          } catch (e) {
            // ignore
          }
          legendControl = null;
        }
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [farmers, onMarkerClick]);

  return <div ref={mapContainerRef} id="farmers-map" style={{ width: '100%', height: '100%' }} />;
}


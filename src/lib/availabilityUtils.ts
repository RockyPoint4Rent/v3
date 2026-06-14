import { supabase } from './supabase';

export type PropertyAvailability = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  image: string;
  badge: string;
  amenities: string[];
  available: boolean;
  unavailableReason?: string;
};

// Static display data keyed by property name — must match names in the DB `properties` table
const PROPERTY_DETAILS: Record<string, Omit<PropertyAvailability, 'available' | 'unavailableReason'>> = {
  'Casa Margaritas': {
    id: 1,
    name: 'Casa Margaritas',
    tagline: 'Comfortable Heart of Rocky Point',
    description:
      'A cozy, fully equipped central getaway with modern comforts and easy access to Rocky Point attractions. Perfect for groups seeking a vibrant local experience.',
    bedrooms: 5,
    bathrooms: 2.5,
    maxGuests: 10,
    image: 'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.21.05_PM_i2zdmx.jpg?auto=compress&cs=tinysrgb&w=900',
    badge: 'Most Popular',
    amenities: ['A/C', 'WiFi', 'Full Kitchen', 'Parking'],
  },
  'Casa Tropical Mango': {
    id: 2,
    name: 'Casa Tropical Mango',
    tagline: 'Tropical Comfort Near the Beach',
    description:
      'A bright tropical retreat near the beach, offering comfort, convenience, and all essential amenities. Ideal for large family gatherings.',
    bedrooms: 7,
    bathrooms: 4,
    maxGuests: 14,
    image: 'https://res.cloudinary.com/dq9mbqfct/image/upload/v1778347793/mango_jcbjpi.png',
    badge: 'Largest Property',
    amenities: ['A/C', 'WiFi', 'BBQ Grill', 'Beach Access'],
  },
  'Casa Delphine': {
    id: 3,
    name: 'Casa Delphine',
    tagline: 'Charming Coastal Home for Families',
    description:
      'A cozy, fully equipped coastal retreat with A/C, WiFi, and a central location close to the beach. The ideal family sanctuary.',
    bedrooms: 6,
    bathrooms: 4,
    maxGuests: 12,
    image: 'https://res.cloudinary.com/dq9mbqfct/image/upload/WhatsApp_Image_2026-04-15_at_10.30.52_PM_uncyqm.jpg?auto=compress&cs=tinysrgb&w=900',
    badge: 'Family Favorite',
    amenities: ['A/C', 'WiFi', 'Patio', 'Near Beach'],
  },
};

// Kept for backward-compat with components that import ALL_PROPERTIES
export const ALL_PROPERTIES = Object.values(PROPERTY_DETAILS);

export async function checkAvailability(
  checkIn: string,
  checkOut: string,
  totalGuests: number
): Promise<PropertyAvailability[]> {
  const { data: rows, error } = await supabase.rpc('check_property_availability', {
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  if (error) {
    console.error('check_property_availability RPC error:', error);
    throw new Error(`Availability check failed: ${error.message}`);
  }

  // DB returns: { property_name: string, is_booked: boolean }[]
  // Map each row directly to display data — availability is the DB's decision, not ours.
  const dbRows = (rows ?? []) as { property_name: string; is_booked: boolean }[];

  return dbRows
    .map((row): PropertyAvailability | null => {
      const details = PROPERTY_DETAILS[row.property_name];
      if (!details) return null; // property in DB not in display list — skip

      if (totalGuests > details.maxGuests) {
        return {
          ...details,
          available: false,
          unavailableReason: `Accommodates up to ${details.maxGuests} guests`,
        };
      }

      if (row.is_booked) {
        return {
          ...details,
          available: false,
          unavailableReason: 'Not available for these dates',
        };
      }

      return { ...details, available: true };
    })
    .filter((p): p is PropertyAvailability => p !== null)
    .sort((a, b) => a.id - b.id);
}

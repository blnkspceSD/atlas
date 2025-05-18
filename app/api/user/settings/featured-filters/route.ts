import { NextRequest, NextResponse } from 'next/server';
import { FeaturedFilterSettings } from '@/components/FeaturedFilterModal';

// For demo: In a real app, this would be stored in a database
let userFeaturedFilters: Record<string, FeaturedFilterSettings> = {};

/**
 * GET /api/user/settings/featured-filters
 * Get the current user's featured filter settings
 */
export async function GET(request: NextRequest) {
  try {
    // In a real application, this would authenticate the user and get their ID
    // For demo purposes, we'll use a mock user ID
    const mockUserId = 'user-123';
    
    // Get the settings for this user (or return default settings)
    const settings = userFeaturedFilters[mockUserId] || {
      employmentType: 'full-time',
      criteria: {
        hasSalary: true,
        remoteOnly: true,
        seniorLevel: false,
        recentlyPosted: false,
        largeCompany: false,
        hasEquity: false,
        visaSponsorship: false,
      }
    };
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error getting featured filter settings:', error);
    return NextResponse.json(
      { error: 'Failed to get featured filter settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/settings/featured-filters
 * Save the user's featured filter settings
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const settings = await request.json();
    
    // Validate the settings object
    if (!settings || !settings.employmentType || !settings.criteria) {
      return NextResponse.json(
        { error: 'Invalid settings object' },
        { status: 400 }
      );
    }
    
    // In a real application, this would authenticate the user and get their ID
    // For demo purposes, we'll use a mock user ID
    const mockUserId = 'user-123';
    
    // Save the settings
    userFeaturedFilters[mockUserId] = settings;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving featured filter settings:', error);
    return NextResponse.json(
      { error: 'Failed to save featured filter settings' },
      { status: 500 }
    );
  }
} 
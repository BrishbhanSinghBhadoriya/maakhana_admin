import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, Product } from '@/lib/products-data';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || body.price === undefined || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, price, category' },
        { status: 400 }
      );
    }

    const newProduct = await addProduct({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      category: body.category,
      mealType: body.mealType || '',
      day: body.day || '',
      dailyCost: body.dailyCost || '',
      kitchenCost: body.kitchenCost || '',
      image: body.image || '🍱',
      items: body.items || [],
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}


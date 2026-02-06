'use client';

import { useState } from 'react';
import { Loader2, RefreshCcw, Utensils, Dumbbell, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetProducts, useUpdateMenu } from '@/hooks/useProduct';
import { Loader } from "@/components/ui/loader";
import { useQueryClient } from "@tanstack/react-query";
import { Root2, SubscriptionType, Menus, GymBroPack, Breakfast, Lunch, Dinner2 } from '@/Types/product.types';
import { UpdateMenuModal } from './_components/UpdateMenuModal';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data: productsData, isLoading, isError, error } = useGetProducts();
  const updateMenuMutation = useUpdateMenu();
  const [activeTab, setActiveTab] = useState("menu");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<{ day: string; type: string; data: any } | null>(null);

  const handleEditClick = (day: string, type: string, data: any) => {
    setCurrentEditItem({ day, type, data });
    setIsModalOpen(true);
  };

  const handleUpdateMenu = async (updatedData: any) => {
    if (!productData?._id) return;

    let payload: any = {};
    const { day, type } = currentEditItem || {};

    // Helper to construct GymBro payload
    if (day === 'Daily' || day === 'Vegetarian' || day === 'Non-Vegetarian') {
      const gymBroMap: Record<string, any> = {
        'Breakfast': { key: 'breakfast', nested: false }, // No nested structure for breakfast anymore
        'Dinner': { key: 'dinner', nested: false },
        'Lunch - Vegetarian': { key: 'lunch', subKey: 'veg', nested: true },
        'Lunch - Non-Vegetarian': { key: 'lunch', subKey: 'nonVeg', nested: true }
      };

      // Construct key for lookup (Lunch has subtypes)
      const lookupKey = type === 'Lunch' ? `${type} - ${day}` : type;
      const config = gymBroMap[lookupKey!];

      if (config) {
        // Map modal fields to GymBro schema
        let transformedData: any = {};
        if (lookupKey === 'Breakfast') {
          transformedData = {
            protein: updatedData.main,
            carbs: updatedData.carbs
          };
        } else if (lookupKey === 'Lunch - Vegetarian') {
          transformedData = {
            main: updatedData.main,
            protein: updatedData.vegetables, // Modal's vegetables map to protein for GB Lunch Veg
            carbs: updatedData.carbs
          };
        } else if (lookupKey === 'Lunch - Non-Vegetarian') {
          transformedData = {
            main: updatedData.main,
            quantity: updatedData.quantity,
            sides: updatedData.sides
          };
        } else if (lookupKey === 'Dinner') {
          transformedData = {
            protein: updatedData.main.split(',').map((s: string) => s.trim()).filter(Boolean),
            carbs: updatedData.carbs,
            vegetables: updatedData.vegetables
          };
        }

        if (config.nested) {
          payload = {
            gymBroPack: {
              [config.key]: {
                [config.subKey]: transformedData
              }
            }
          };
        } else {
          payload = {
            gymBroPack: {
              [config.key]: transformedData
            }
          };
        }
      }
    } else {
      // Regular Menu Update (Breakfast/Lunch/Dinner)
      // payload structure: { [type]: { items: { [day]: updatedData } } }
      if (type && day) {
        payload = {
          [type]: {
            items: {
              [day]: updatedData
            }
          }
        };
      }
    }

    try {
      await updateMenuMutation.mutateAsync({
        id: (productData._id as any).$oid || (productData._id as any),
        data: payload
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update menu:", error);
    }
  };


  const productData: Root2 | undefined = productsData?.[0];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader size={40} />
      </div>
    );
  }

  if (isError || !productData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-4">
        <p>Error loading menu data: {(error as Error)?.message || "No data available"}</p>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Menu & Plans Management</h1>
          <p className="text-gray-500 mt-1">Manage subscription plans, weekly menus, and special packs.</p>
        </div>
      </div>

      <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 border h-auto flex-wrap justify-start w-full sm:w-auto">
          <TabsTrigger value="menu" className="px-6 py-2.5 gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
            <Utensils className="h-4 w-4" /> Weekly Menu
          </TabsTrigger>
          <TabsTrigger value="gymbro" className="px-6 py-2.5 gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
            <Dumbbell className="h-4 w-4" /> Gym Bro Pack
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          <MenuSection
            breakfast={productData.breakfast}
            lunch={productData.lunch}
            dinner={productData.dinner}
            onEdit={handleEditClick}
          />
        </TabsContent>

        <TabsContent value="gymbro" className="space-y-6">
          <GymBroSection gymBroPack={productData.gymBroPack} onEdit={handleEditClick} />
        </TabsContent>
      </Tabs>

      {currentEditItem && (
        <UpdateMenuModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={currentEditItem.day}
          type={currentEditItem.type}
          initialData={currentEditItem.data}
          onSubmit={handleUpdateMenu}
        />
      )}
    </div>
  );
}

// --- Sub-Components ---



function MenuSection({
  breakfast,
  lunch,
  dinner,
  onEdit
}: {
  breakfast: Breakfast;
  lunch: Lunch;
  dinner: Dinner2;
  onEdit: (day: string, type: string, data: any) => void
}) {
  return (
    <Tabs defaultValue="lunch" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
        <TabsTrigger value="breakfast" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:shadow-none px-4 py-3">Breakfast</TabsTrigger>
        <TabsTrigger value="lunch" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:shadow-none px-4 py-3">Lunch</TabsTrigger>
        <TabsTrigger value="dinner" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:shadow-none px-4 py-3">Dinner</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="breakfast">
          <DailyGrid items={breakfast.items} type="breakfast" onEdit={onEdit} />
        </TabsContent>
        <TabsContent value="lunch">
          <DailyGrid items={lunch.items} type="lunch" onEdit={onEdit} />
        </TabsContent>
        <TabsContent value="dinner">
          <DailyGrid items={dinner.items} type="dinner" onEdit={onEdit} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function DailyGrid({ items, type, onEdit }: { items: any, type: string; onEdit: (day: string, type: string, data: any) => void }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {days.map(day => {
        const dayItem = items[day];
        if (!dayItem) return null;

        return (
          <Card key={day} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md group bg-white">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                alt={day}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3 z-10 opacity-100 md:opacity-0 group-hover:md:opacity-100 transition-opacity duration-300 md:pointer-events-none group-hover:md:pointer-events-auto">
                <Button
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-orange-600 shadow-lg border border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(day, type, dayItem);
                  }}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <Badge variant="secondary" className="mb-2 bg-orange-500/90 text-white hover:bg-orange-500 backdrop-blur-md border-0 capitalize shadow-sm">
                  {type}
                </Badge>
                <h3 className="text-2xl font-bold capitalize tracking-tight text-white mb-0.5">{day}</h3>
                {dayItem.name && <p className="text-white/80 text-sm line-clamp-1 font-medium">{dayItem.name}</p>}
              </div>
            </div>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                {dayItem.main && (
                  <div className="group/item">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Main Dish</span>
                    <p className="text-gray-700 font-medium line-clamp-2 leading-snug">{dayItem.main}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-dashed border-gray-100">
                  {dayItem.quantity && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-gray-400 block mb-1">Quantity</span>
                      <span className="text-sm font-semibold text-gray-700">{dayItem.quantity}</span>
                    </div>
                  )}
                  {dayItem.style && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-gray-400 block mb-1">Style</span>
                      <span className="text-sm font-semibold text-gray-700">{dayItem.style}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-dashed border-gray-100">
                  {dayItem.vegetables?.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-green-600/80 block mb-1.5 uppercase tracking-wider">Vegetables</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dayItem.vegetables.map((veg: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 px-1.5 py-0.5 font-normal">
                            {veg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {dayItem.carbs?.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-yellow-600/80 block mb-1.5 uppercase tracking-wider">Carbs</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dayItem.carbs.map((carb: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200 px-1.5 py-0.5 font-normal">
                            {carb}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {dayItem.sides?.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-blue-600/80 block mb-1.5 uppercase tracking-wider">Sides</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dayItem.sides.map((side: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-blue-100 px-1.5 py-0.5 font-normal">
                            {side}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function GymBroSection({ gymBroPack, onEdit }: { gymBroPack: GymBroPack; onEdit: (day: string, type: string, data: any) => void }) {

  // Transform GymBroPack data into an array of displayable items
  const mealItems = [
    {
      id: 'breakfast',
      title: 'Breakfast',
      sub: 'Daily',
      image: 'https://images.unsplash.com/photo-1525351463629-487053856d6b?auto=format&fit=crop&q=80&w=800',
      data: gymBroPack.breakfast,
      type: 'gymbro-breakfast', // Custom type key for modal
      displayData: {
        main: gymBroPack.breakfast.protein,
        carbs: gymBroPack.breakfast.carbs,
      }
    },
    {
      id: 'lunch-veg',
      title: 'Lunch',
      sub: 'Vegetarian',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800',
      data: gymBroPack.lunch.veg,
      type: 'gymbro-lunch-veg',
      displayData: {
        main: gymBroPack.lunch.veg.main,
        vegetables: gymBroPack.lunch.veg.protein, // Using veg field to show protein for this layout
        carbs: gymBroPack.lunch.veg.carbs,
        proteinLabel: true
      }
    },
    {
      id: 'lunch-nonveg',
      title: 'Lunch',
      sub: 'Non-Vegetarian',
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
      data: gymBroPack.lunch.nonVeg,
      type: 'gymbro-lunch-nonveg',
      displayData: {
        main: gymBroPack.lunch.nonVeg.main,
        quantity: gymBroPack.lunch.nonVeg.quantity,
        sides: gymBroPack.lunch.nonVeg.sides,
      }
    },
    {
      id: 'dinner',
      title: 'Dinner',
      sub: 'Daily',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      data: gymBroPack.dinner,
      type: 'gymbro-dinner',
      displayData: {
        main: gymBroPack.dinner.protein.join(', '),
        carbs: gymBroPack.dinner.carbs,
        vegetables: gymBroPack.dinner.vegetables,
      }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mealItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md group bg-white">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3 z-10 opacity-100 md:opacity-0 group-hover:md:opacity-100 transition-opacity duration-300 md:pointer-events-none group-hover:md:pointer-events-auto">
                <Button
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-purple-600 shadow-lg border border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item.sub, item.title, item.data);
                  }}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <Badge variant="secondary" className="mb-2 bg-purple-500/90 text-white hover:bg-purple-500 backdrop-blur-md border-0 capitalize shadow-sm">
                  {item.sub}
                </Badge>
                <h3 className="text-2xl font-bold capitalize tracking-tight text-white mb-0.5">{item.title}</h3>
              </div>
            </div>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                {item.displayData.main && (
                  <div className="group/item">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Main / Protein
                    </span>
                    <p className="text-gray-700 font-medium line-clamp-2 leading-snug">{item.displayData.main}</p>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-dashed border-gray-100">
                  {item.displayData.quantity && (
                    <div>
                      <span className="text-xs font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">Quantity</span>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200 font-normal">
                        {item.displayData.quantity}
                      </Badge>
                    </div>
                  )}

                  {Array.isArray(item.displayData.vegetables) && item.displayData.vegetables.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-green-600/80 block mb-1.5 uppercase tracking-wider">
                        Vegetables
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.displayData.vegetables.map((veg, i) => (
                          <Badge key={`v-${i}`} variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 px-1.5 py-0.5 font-normal">
                            {veg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(item.displayData.carbs) && item.displayData.carbs.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-yellow-600/80 block mb-1.5 uppercase tracking-wider">
                        Carbs
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.displayData.carbs.map((carb, i) => (
                          <Badge key={`c-${i}`} variant="outline" className="text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200 px-1.5 py-0.5 font-normal">
                            {carb}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(item.displayData.sides) && item.displayData.sides.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-blue-600/80 block mb-1.5 uppercase tracking-wider">
                        Sides
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.displayData.sides.map((side, i) => (
                          <Badge key={`s-${i}`} variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-blue-100 px-1.5 py-0.5 font-normal">
                            {side}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customization Options</CardTitle>
          <CardDescription>Frequency: {gymBroPack.customization.frequency}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gymBroPack.customization.options.map((option, index) => (
              <div key={index} className="border p-3 rounded-lg bg-gray-50">
                <div className="font-medium capitalize mb-2">{option.type.replace('_', ' ')}</div>
                <div className="flex flex-wrap gap-1">
                  {option.options.map((opt, i) => (
                    <Badge key={i} variant="secondary" className="bg-white">{opt}</Badge>
                  ))}
                </div>
                {option.meal && <div className="text-xs text-gray-500 mt-2 capitalize">For: {option.meal}</div>}
                {option.meals && <div className="text-xs text-gray-500 mt-2 capitalize">For: {option.meals.join(", ")}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

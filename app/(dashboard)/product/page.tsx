'use client';

import { useState } from 'react';
import { Loader2, RefreshCcw, Utensils, Dumbbell, Pencil, Sun, Moon, Star, Drumstick, Salad, Flame, Sparkles, Egg } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetProducts, useUpdateMenu } from '@/hooks/useProduct';
import { Loader } from "@/components/ui/loader";
import { useQueryClient } from "@tanstack/react-query";
import { Root2, GymBroPack } from '@/Types/product.types';
import { UpdateMenuModal } from './_components/UpdateMenuModal';
import Image from 'next/image';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data: productsData, isLoading, isError, error } = useGetProducts();
  const updateMenuMutation = useUpdateMenu();
  const [activeTab, setActiveTab] = useState<'menu' | 'gymbro'>('menu');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

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

    if (day === 'Daily' || day === 'Vegetarian' || day === 'Non-Vegetarian') {
      const gymBroMap: Record<string, any> = {
        'Breakfast': { key: 'breakfast', nested: false },
        'Dinner': { key: 'dinner', nested: false },
        'Lunch - Vegetarian': { key: 'lunch', subKey: 'veg', nested: true },
        'Lunch - Non-Vegetarian': { key: 'lunch', subKey: 'nonVeg', nested: true }
      };

      const lookupKey = type === 'Lunch' ? `${type} - ${day}` : type;
      const config = gymBroMap[lookupKey!];

      if (config) {
        let transformedData: any = {};
        if (lookupKey === 'Breakfast') {
          transformedData = {
            protein: updatedData.main,
            carbs: updatedData.carbs,
            image: updatedData.image
          };
        } else if (lookupKey === 'Lunch - Vegetarian') {
          transformedData = {
            main: updatedData.main,
            protein: updatedData.vegetables,
            carbs: updatedData.carbs,
            image: updatedData.image
          };
        } else if (lookupKey === 'Lunch - Non-Vegetarian') {
          transformedData = {
            main: updatedData.main,
            quantity: updatedData.quantity,
            sides: updatedData.sides,
            image: updatedData.image
          };
        } else if (lookupKey === 'Dinner') {
          transformedData = {
            protein: updatedData.main.split(',').map((s: string) => s.trim()).filter(Boolean),
            carbs: updatedData.carbs,
            vegetables: updatedData.vegetables,
            image: updatedData.image
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
    <div className="bg-background relative pb-6">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-radial from-amber-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-gradient-radial from-orange-300/15 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
     <section className="pt-6 pb-4 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto text-center">
    
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4">
      <Sparkles className="w-4 h-4 text-black" />
      <span className="text-sm font-semibold text-black">Menu Management</span>
    </div>

    <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-3 leading-tight">
      <span className="text-black">Manage Your Menu</span><br />
      <span className="text-black text-2xl md:text-4xl">Weekly Plans & Gym Packs</span>
    </h1>

    <p className="text-base md:text-lg text-black max-w-2xl mx-auto mb-4">
      Update breakfast, lunch, dinner menus and gym bro pack configurations
    </p>

    {/* Tab Buttons */}
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => setActiveTab('menu')}
        className={`px-5 py-2.5 rounded-lg font-semibold transition ${
          activeTab === 'menu'
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-gray-100 text-black border border-gray-300 hover:bg-gray-200'
        }`}
      >
        <span className="flex items-center gap-2">
          <Utensils className="w-4 h-4" />
          Weekly Menu
        </span>
      </button>

      <button
        onClick={() => setActiveTab('gymbro')}
        className={`px-5 py-2.5 rounded-lg font-semibold transition ${
          activeTab === 'gymbro'
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-gray-100 text-black border border-gray-300 hover:bg-gray-200'
        }`}
      >
        <span className="flex items-center gap-2">
          <Flame className="w-4 h-4" />
          Gym Bro Pack
        </span>
      </button>
    </div>

  </div>
</section>


      {/* Weekly Menu Section */}
      {activeTab === 'menu' && (
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-orange-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg icon-box-glow">
                  <Star className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
                Weekly Menu Management
              </h2>
              <p className="text-xl text-muted-foreground">
                Manage your 7-day meal rotations
              </p>
            </div>

            {/* Meal Type Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => setSelectedMealType('breakfast')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedMealType === 'breakfast'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-foreground hover:bg-white/20 border border-border'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Breakfast
                </span>
              </button>
              <button
                onClick={() => setSelectedMealType('lunch')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedMealType === 'lunch'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-foreground hover:bg-white/20 border border-border'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Lunch
                </span>
              </button>
              <button
                onClick={() => setSelectedMealType('dinner')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedMealType === 'dinner'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-foreground hover:bg-white/20 border border-border'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Dinner
                </span>
              </button>
            </div>

            {/* Menu Days Grid */}
            <DailyMenuGrid
              items={productData[selectedMealType].items}
              type={selectedMealType}
              onEdit={handleEditClick}
            />
          </div>
        </section>
      )}

      {/* Gym Bro Pack Section */}
      {activeTab === 'gymbro' && (
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50/30 to-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg icon-box-glow">
                  <Flame className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
                Gym Bro Pack Management
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                High-protein meal configurations
              </p>
            </div>

            <GymBroGrid gymBroPack={productData.gymBroPack} onEdit={handleEditClick} />
          </div>
        </section>
      )}

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

// Daily Menu Grid Component
function DailyMenuGrid({ items, type, onEdit }: { items: any; type: string; onEdit: (day: string, type: string, data: any) => void }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Different food images per meal-type + day (breakfast, lunch, dinner), all distinct
  const imagesByType: Record<string, Record<string, string>> = {
    breakfast: {
      monday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298295/poha_zkegj5.png',   
      tuesday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298293/khechdi_xr4voc.png',  
      wednesday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298295/7_lzgxwk.png', 
      thursday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298294/oots_cdevgd.png',   
      friday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298297/8_exmytc.png', 
      saturday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298295/sandbich_gurcqh.png', 
      sunday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298296/9_ysgosg.png',   
    },
    lunch: {
      monday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298296/11_fakzfj.png',
      tuesday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298296/14_rmzf63.png',    
      wednesday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298294/4_iml8ua.png', 
      thursday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298293/1_guifrs.png',    
      friday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298293/1_guifrs.png',   
      saturday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298294/4_iml8ua.png', 
      sunday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298295/6_vgwbyd.png',   
    },
    dinner: {
      monday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302225/d1_p2tykc.png',   
      tuesday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302235/d6_haxwts.png',  
      wednesday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302226/d3_ftrm1f.png', 
      thursday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302227/d4_ccgfsk.png', 
      friday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302227/d4_ccgfsk.png',   
      saturday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302219/d2_zb6crm.png',   
      sunday: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302235/g3_itjv4l.png',  
    },
  };

  const getMealIcon = () => {
    if (type === 'breakfast') return Sun;
    if (type === 'lunch') return Sun;
    return Moon;
  };

  const getMealColor = () => {
    if (type === 'breakfast') return 'from-yellow-400 to-orange-500';
    if (type === 'lunch') return 'from-green-400 to-emerald-500';
    return 'from-purple-400 to-pink-500';
  };

  const MealIcon = getMealIcon();
  const gradientColor = getMealColor();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {days.map((day, index) => {
        const dayItem = items[day];
        if (!dayItem) return null;

        const imageSrc =
          dayItem.image ||
          imagesByType[type]?.[day] ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

        return (
          <div
            key={day}
            className="card-premium rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 bg-white border border-border shadow-lg group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image Header */}
            <div className="relative h-52 w-full overflow-hidden bg-white">
              <Image
                src={imageSrc}
                alt={`${day} Menu`}
                fill
                className="object-cover p-3 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              
              {/* Edit Button */}
              <div className="absolute top-4 right-4">
                <Button
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-orange-600 shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onEdit(day, type, dayItem)}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>

              <div className="absolute top-4 left-4">
                <h3 className="text-xl font-poppins font-bold text-white drop-shadow-lg capitalize">
                  {day}
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Meal Type Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${gradientColor} rounded-lg flex items-center justify-center shadow-sm`}>
                    <MealIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-primary uppercase">{type}</p>
                </div>

                {/* Main Content */}
                {dayItem.name && (
                  <div>
                    <p className="font-semibold mb-1 text-foreground">{dayItem.name}</p>
                  </div>
                )}

                {dayItem.main && (
                  <div className="pb-3 border-b border-border">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Main Dish</span>
                    <p className="font-medium text-foreground">{dayItem.main}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {dayItem.quantity && (
                    <div>
                      <span className="text-xs font-bold text-gray-400 block mb-1">Quantity</span>
                      <span className="text-sm font-semibold text-gray-700">{dayItem.quantity}</span>
                    </div>
                  )}
                  {dayItem.style && (
                    <div>
                      <span className="text-xs font-bold text-gray-400 block mb-1">Style</span>
                      <span className="text-sm font-semibold text-gray-700">{dayItem.style}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t border-dashed border-gray-100">
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Gym Bro Grid Component
function GymBroGrid({ gymBroPack, onEdit }: { gymBroPack: GymBroPack; onEdit: (day: string, type: string, data: any) => void }) {
  const mealItems = [
    {
      id: 'breakfast',
      title: 'Breakfast',
      sub: 'Daily',
      icon: Sun,
      gradient: 'from-yellow-400 to-orange-500',
      data: gymBroPack.breakfast,
      displayData: {
        main: gymBroPack.breakfast.protein,
        carbs: gymBroPack.breakfast.carbs,
      }
    },
    {
      id: 'lunch-veg',
      title: 'Lunch',
      sub: 'Vegetarian',
      icon: Salad,
      gradient: 'from-green-400 to-emerald-500',
      data: gymBroPack.lunch.veg,
      displayData: {
        main: gymBroPack.lunch.veg.main,
        vegetables: gymBroPack.lunch.veg.protein,
        carbs: gymBroPack.lunch.veg.carbs,
      }
    },
    {
      id: 'lunch-nonveg',
      title: 'Lunch',
      sub: 'Non-Vegetarian',
      icon: Drumstick,
      gradient: 'from-red-500 to-orange-500',
      data: gymBroPack.lunch.nonVeg,
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
      icon: Moon,
      gradient: 'from-purple-400 to-pink-500',
      data: gymBroPack.dinner,
      displayData: {
        main: gymBroPack.dinner.protein.join(', '),
        carbs: gymBroPack.dinner.carbs,
        vegetables: gymBroPack.dinner.vegetables,
      }
    }
  ];


  const gymImages: Record<string, string> = {
    breakfast: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770298293/2_ieqhly.png', 
    'lunch-veg': 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302235/g3_itjv4l.png', 
    'lunch-nonveg': 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302235/g2_cj4k5o.png', 
    dinner: 'https://res.cloudinary.com/didkrwhbu/image/upload/v1770302239/g1_m0kk7g.png', 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mealItems.map((item, index) => {
        const IconComponent = item.icon;
        const imageSrc =
          (item.data as any)?.image ||
          gymImages[item.id] ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

        return (
          <div
            key={item.id}
            className="card-premium rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 bg-white border border-border shadow-lg group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative h-52 w-full overflow-hidden bg-white">
              <Image
                src={imageSrc}
                alt={`${item.title} - ${item.sub}`}
                fill
                className="object-cover p-3 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              
              {/* Edit Button */}
              <div className="absolute top-4 right-4">
                <Button
                  size="icon"
                  className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-purple-600 shadow-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onEdit(item.sub, item.title, item.data)}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>

              <div className="absolute top-4 left-4">
                <h3 className="text-xl font-poppins font-bold text-white drop-shadow-lg">
                  {item.title}
                </h3>
                <Badge variant="secondary" className="mt-1 bg-purple-500/90 text-white hover:bg-purple-500 backdrop-blur-md border-0 capitalize shadow-sm">
                  {item.sub}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Meal Type Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-primary uppercase">Gym Bro</p>
                </div>

                {item.displayData.main && (
                  <div className="pb-3 border-b border-border">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Main / Protein</span>
                    <p className="font-medium text-foreground">{item.displayData.main}</p>
                  </div>
                )}

                {item.displayData.quantity && (
                  <div>
                    <span className="text-xs font-bold text-gray-400 block mb-1">Quantity</span>
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200 font-normal">
                      {item.displayData.quantity}
                    </Badge>
                  </div>
                )}

                <div className="space-y-3 pt-2 border-t border-dashed border-gray-100">
                  {Array.isArray(item.displayData.vegetables) && item.displayData.vegetables.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-green-600/80 block mb-1.5 uppercase tracking-wider">Vegetables/Protein</span>
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
                      <span className="text-xs font-bold text-yellow-600/80 block mb-1.5 uppercase tracking-wider">Carbs</span>
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
                      <span className="text-xs font-bold text-blue-600/80 block mb-1.5 uppercase tracking-wider">Sides</span>
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
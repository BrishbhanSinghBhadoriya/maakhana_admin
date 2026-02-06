'use client';

import { useFormik } from 'formik';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Utensils, Scale, ChefHat, Carrot, Wheat, Soup, PenLine } from 'lucide-react';

interface UpdateMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    day: string;
    type: string;
    initialData: any;
    onSubmit: (data: any) => Promise<void>;
}

interface MenuFormData {
    name: string;
    main: string;
    quantity: string;
    style: string;
    vegetables: string;
    carbs: string;
    sides: string;
}

export function UpdateMenuModal({
    isOpen,
    onClose,
    day,
    type,
    initialData,
    onSubmit,
}: UpdateMenuModalProps) {
    const formik = useFormik<MenuFormData>({
        initialValues: {
            name: initialData?.name || '',
            main: initialData?.main || (typeof initialData?.protein === 'string' ? initialData.protein : initialData?.protein?.join(', ')) || '',
            quantity: initialData?.quantity || '',
            style: initialData?.style || '',
            vegetables: (initialData?.vegetables || (initialData?.main && Array.isArray(initialData?.protein) ? initialData.protein : []))?.join(', ') || '',
            carbs: initialData?.carbs?.join(', ') || '',
            sides: initialData?.sides?.join(', ') || '',
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formattedData = {
                ...values,
                vegetables: values.vegetables.split(',').map(item => item.trim()).filter(Boolean),
                carbs: values.carbs.split(',').map(item => item.trim()).filter(Boolean),
                sides: values.sides.split(',').map(item => item.trim()).filter(Boolean),
            };
            await onSubmit(formattedData);
            onClose();
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:w-full sm:max-w-[650px] max-h-[95vh] overflow-y-auto p-0 gap-0 rounded-xl">
                <DialogHeader className="p-4 sm:p-6 pb-2 bg-gradient-to-r from-orange-50 to-orange-100/50 pt-6 sm:pt-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-orange-100 placeholder:text-orange-500">
                            <Utensils className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl capitalize flex items-center gap-2">
                                Edit Menu <span className="text-gray-400 font-normal">|</span> {day}
                            </DialogTitle>
                            <DialogDescription className="mt-1.5 flex items-center gap-2 text-orange-700/80 font-medium">
                                <span className="px-2 py-0.5 rounded-md bg-orange-100/50 border border-orange-200/50 text-xs uppercase tracking-wider">
                                    {type}
                                </span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 grid gap-4 sm:gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                            <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                                <PenLine className="w-4 h-4 text-orange-500" /> Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-10 border-gray-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all bg-gray-50/30"
                                placeholder="e.g. Special Thali"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="main" className="text-gray-700 font-medium flex items-center gap-2">
                                <ChefHat className="w-4 h-4 text-orange-500" /> Main Dish / Protein
                            </Label>
                            <Input
                                id="main"
                                name="main"
                                value={formik.values.main}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-10 border-gray-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all bg-gray-50/30"
                                placeholder="e.g. Paneer Butter Masala"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="quantity" className="text-gray-700 font-medium flex items-center gap-2">
                                <Scale className="w-4 h-4 text-orange-500" /> Quantity
                            </Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-10 border-gray-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all bg-gray-50/30"
                                placeholder="e.g. 200g or 2 pcs"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="style" className="text-gray-700 font-medium flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-orange-500" /> Style
                            </Label>
                            <Input
                                id="style"
                                name="style"
                                value={formik.values.style}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-10 border-gray-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all bg-gray-50/30"
                                placeholder="e.g. Gravy or Dry"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2.5">
                            <Label htmlFor="vegetables" className="text-gray-700 font-medium flex items-center gap-2">
                                <Carrot className="w-4 h-4 text-green-600" /> Vegetables
                            </Label>
                            <Input
                                id="vegetables"
                                name="vegetables"
                                value={formik.values.vegetables}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-10 border-gray-200 focus-visible:ring-green-500/20 focus-visible:border-green-500 transition-all bg-gray-50/30"
                                placeholder="Comma separated"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="carbs" className="text-gray-700 font-medium flex items-center gap-2">
                                <Wheat className="w-4 h-4 text-yellow-600" /> Carbs
                            </Label>
                            <Input
                                id="carbs"
                                name="carbs"
                                value={formik.values.carbs}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-10 border-gray-200 focus-visible:ring-yellow-500/20 focus-visible:border-yellow-500 transition-all bg-gray-50/30"
                                placeholder="Comma separated"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="sides" className="text-gray-700 font-medium flex items-center gap-2">
                                <Soup className="w-4 h-4 text-blue-600" /> Sides
                            </Label>
                            <Input
                                id="sides"
                                name="sides"
                                value={formik.values.sides}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="h-10 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all bg-gray-50/30"
                                placeholder="Comma separated"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto border-gray-200 hover:bg-gray-50 text-gray-700 font-medium order-1 sm:order-none">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={formik.isSubmitting} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm shadow-orange-200">
                            {formik.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

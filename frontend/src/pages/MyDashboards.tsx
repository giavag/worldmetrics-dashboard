import React, { useEffect, useState } from 'react';
import { savedWidgetService } from '../services/savedWidgetService';
import type { SavedWidgetResponse } from '../types/savedWidget';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {DashboardWidget} from "@/components/DashboardWidget.tsx";

export const MyDashboards: React.FC = () => {
    // State management
    const [widgets, setWidgets] = useState<SavedWidgetResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchWidgets();
    }, []);

    const fetchWidgets = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await savedWidgetService.getUserWidgets();
            setWidgets(data);
        } catch (err: any) {
            console.error('Error fetching widgets:', err);
            setError('Failed to load your dashboards. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (widgetId: number) => {
        if (!window.confirm('Are you sure you want to delete this widget?')) {
            return;
        }

        try {
            await savedWidgetService.deleteWidget(widgetId);
            setWidgets((prevWidgets) => prevWidgets.filter(w => w.id !== widgetId));
        } catch (err: any) {
            console.error('Error deleting widget:', err);
            alert('Failed to delete the widget.');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-600">Loading your dashboards...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Dashboards</h1>
            </div>

            {widgets.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                    <p className="text-xl">You haven't saved any widgets yet.</p>
                    <p className="mt-2">Go to the Compare section to pin your favorite charts here!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {widgets.map((widget) => (
                        <div key={widget.id} className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
                            {/* Card Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-700 truncate" title={widget.title}>
                                    {widget.title}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(widget.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                    title="Delete Widget"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-4 flex-grow min-h-[300px] w-full bg-gray-50/50">
                                <DashboardWidget widget={widget} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
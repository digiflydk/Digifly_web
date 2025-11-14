
"use client";

import { useEffect, useState, useTransition } from 'react';
import { getLogSettings, saveLogSettings, type LoggingSettings } from '@/lib/dadmin/audit';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LoggingSettings() {
    const [settings, setSettings] = useState<LoggingSettings | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getLogSettings().then(setSettings);
    }, []);
    
    const handleToggle = (key: keyof LoggingSettings | `actions.${string}`, value: boolean) => {
        setSettings(prev => {
            if (!prev) return null;
            const newSettings = { ...prev, actions: { ...prev.actions } };
            if (key.startsWith('actions.')) {
                const actionKey = key.split('.')[1];
                (newSettings.actions as any)[actionKey] = value;
            } else {
                (newSettings as any)[key] = value;
            }
            return newSettings;
        });
        setIsDirty(true);
    };

    const handleSave = () => {
        if (!settings) return;
        startTransition(async () => {
            try {
                await saveLogSettings(settings);
                toast({ title: 'Success', description: 'Logging settings saved.' });
                setIsDirty(false);
            } catch (e: any) {
                toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
            }
        });
    };

    if (!settings) {
        return <div className="p-4 border rounded-lg bg-slate-50 text-center">Loading settings...</div>;
    }

    const availableActions = Object.keys(settings.actions).sort() as (keyof LoggingSettings['actions'])[];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Audit Logging</CardTitle>
                <CardDescription>
                    Enable or disable specific audit log events to control Firestore writes.
                    Changes require a save.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="logging-enabled" className="text-base">
                            Enable Logging Globally
                        </Label>
                        <p className="text-sm text-muted-foreground">
                           Master switch for all audit logs.
                        </p>
                    </div>
                    <Switch
                        id="logging-enabled"
                        checked={settings.enabled}
                        onCheckedChange={(v) => handleToggle('enabled', v)}
                    />
                </div>
                
                {settings.enabled && (
                    <div className="space-y-2 pt-4">
                         <h4 className="font-medium text-sm">Per-Action Toggles</h4>
                         {availableActions.map(action => (
                            <div key={action} className="flex items-center justify-between rounded-lg border p-3">
                                <Label htmlFor={`action-${action}`} className="text-sm font-mono">
                                    {action}
                                </Label>
                                <Switch
                                    id={`action-${action}`}
                                    checked={settings.actions[action]}
                                    onCheckedChange={(v) => handleToggle(`actions.${action}`, v)}
                                />
                            </div>
                         ))}
                    </div>
                )}
            </CardContent>
            <div className="px-6 pb-6">
                <Button onClick={handleSave} disabled={isPending || !isDirty}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </div>
        </Card>
    );
}

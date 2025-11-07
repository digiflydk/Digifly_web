
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ENDPOINTS, Endpoint } from '../endpoints';
import { ResultPanel } from './ResultPanel';
import { Loader2 } from 'lucide-react';

type Result = {
  status: number;
  ok: boolean;
  duration: number;
  body: any;
  isJson: boolean;
};

export function EndpointRunner() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm();

  const handleEndpointChange = (value: string) => {
    const endpoint = ENDPOINTS.find(ep => ep.path === value);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      form.reset();
    }
  };
  
  const onSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    setResult(null);

    let path = selectedEndpoint.path;
    selectedEndpoint.params.forEach(param => {
      path = path.replace(`{${param}}`, data[param] || '');
    });

    const start = performance.now();
    try {
        const res = await fetch(path, {
            method: selectedEndpoint.method,
            headers: { 'Content-Type': 'application/json' },
            body: selectedEndpoint.method === 'PUT' ? data.body : undefined,
        });

        const duration = performance.now() - start;
        const text = await res.text();
        let body: any;
        let isJson = false;

        try {
            body = JSON.parse(text);
            isJson = true;
        } catch {
            body = text;
        }

        setResult({ status: res.status, ok: res.ok, duration, body, isJson });

    } catch (error: any) {
        const duration = performance.now() - start;
        setResult({ status: 500, ok: false, duration, body: error.message, isJson: false });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm">
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Endpoint</label>
            <Select onValueChange={handleEndpointChange} defaultValue={selectedEndpoint.path}>
              <SelectTrigger>
                <SelectValue placeholder="Select an endpoint" />
              </SelectTrigger>
              <SelectContent>
                {ENDPOINTS.map((ep, i) => (
                  <SelectItem key={i} value={ep.path}>
                    <span className="font-semibold mr-2">{ep.method}</span>
                    {ep.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedEndpoint.params.map(param => (
            <div key={param}>
              <label htmlFor={param} className="text-sm font-medium capitalize">{param}</label>
              <Input id={param} {...form.register(param)} placeholder={`Enter ${param}`} />
            </div>
          ))}
        </div>
        {selectedEndpoint.method === 'PUT' && (
          <div>
            <label htmlFor="body" className="text-sm font-medium">Request Body</label>
            <Textarea
              id="body"
              {...form.register('body')}
              rows={8}
              className="font-mono text-xs"
              placeholder="Enter JSON body"
              defaultValue={JSON.stringify(selectedEndpoint.sampleBody, null, 2)}
            />
          </div>
        )}
        <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Request
        </Button>
      </form>
      <ResultPanel result={result} isLoading={isLoading} />
    </div>
  );
}

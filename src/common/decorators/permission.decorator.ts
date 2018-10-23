import 'reflect-metadata';

export const PERMISSION_DEFINITION = '__permission_definition__';

export function Permission(role: 'sadmin' | 'admin' | 'editor' | 'user') {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(PERMISSION_DEFINITION, role, target, propertyKey);
    };
}

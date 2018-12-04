// Type definitions for dynogels 9.0
// Project: https://github.com/clarkie/dynogels#readme
// Definitions by: Spartan Labs <https://github.com/SpartanLabs>
//                 Ramon de Klein <https://github.com/ramondeklein>
//                 Stephen Tuso <https://github.com/stephentuso>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

/// <reference types="node" />

export import AWS = require("aws-sdk");
import * as joi from "joi";
import stream = require("stream");
import { Maybe } from '../../../src/types';

// Dynogels Data Members
export let log: Log;
export let models: { [key: string]: Model };
export let types: {
    stringSet(): joi.AnySchema;
    numberSet(): joi.AnySchema;
    binarySet(): joi.AnySchema;
    uuid(): joi.AnySchema;
    timeUUID(): joi.AnySchema;
};

export interface Log {
    info(...args: any[]): void;
    warn(...args: any[]): void;
}

// Dynogels global functions
export function dynamoDriver(dynamoDB: AWS.DynamoDB): AWS.DynamoDB;
export function reset(): void;
export function define<TInput = Record<any, any>, TOutput extends TInput = TInput>(modelName: string, config: ModelConfiguration): Model<TInput, TOutput>;
export function createTables(callback: (err: string) => void): void;
export function createTables(options: { [key: string]: CreateTablesOptions } | DynogelsGlobalOptions, callback: (err: string) => void): void;
export function Set(...args: any[]): any;

export interface DynogelsGlobalOptions {
    $dynogels: {
        pollingInterval: number;
    };
}

export interface CreateTablesOptions {
    readCapacity?: number;
    writeCapacity?: number;
    streamSpecification?: {
        streamEnabled: boolean;
        streamViewType: string;
    };
}

export type LifeCycleAction = "create" | "update" | "destroy";

// Dynogels Model
export interface Model<TInput = Record<any, any>, TOutput extends TInput = TInput> {
    new(attrs: TInput): Item<TOutput>;

    get(hashKey: any, rangeKey: any, options: GetItemOptions, callback: DynogelsItemCallback<TOutput>): void;
    get(haskKey: any, options: GetItemOptions, callback: DynogelsItemCallback<TOutput>): void;
    get(hashKey: any, callback: DynogelsItemCallback<TOutput>): void;
    get(hashKey: any, rangeKey: any, callback: DynogelsItemCallback<TOutput>): void;
    create(item: TInput, options: CreateItemOptions, callback: DynogelsItemCallback<TOutput>): void;
    create(item: TInput, callback: DynogelsItemCallback<TOutput>): void;
    update(item: Partial<TOutput>, options: UpdateItemOptions, callback: DynogelsItemCallback<TOutput>): void;
    update(item: Partial<TOutput>, callback: DynogelsItemCallback<TOutput>): void;
    destroy(hashKey: any, rangeKey: any, options: DestroyItemOptions, callback: DynogelsItemCallback<TOutput>): void;
    destroy(haskKey: any, options: DestroyItemOptions, callback: DynogelsItemCallback<TOutput>): void;
    destroy(hashKey: any, callback: DynogelsItemCallback<TOutput>): void;
    destroy(hashKey: any, rangeKey: any, callback: DynogelsItemCallback<TOutput>): void;
    destroy(item: Partial<TOutput>, options: DestroyItemOptions, callback: DynogelsItemCallback<TOutput>): void;
    destroy(item: Partial<TOutput>, callback: DynogelsItemCallback<TOutput>): void;
    query(hashKey: any): Query<TOutput>;
    scan(): Scan<TOutput>;
    parallelScan(totalSegments: number): Scan;
    getItems(items: string[] | Array<Record<keyof TOutput, string>>, callback: DynogelsItemArrayCallback<TOutput>): void;
    getItems(items: string[] | Array<Record<keyof TOutput, string>>, options: GetItemOptions, callback:DynogelsItemArrayCallback<TOutput>): void;
    batchGetItems(items: string[] | Array<Record<keyof TOutput, string>>, callback: DynogelsItemArrayCallback<TOutput>): void;
    batchGetItems(items: string[] | Array<Record<keyof TOutput, string>>, options: GetItemOptions, callback: DynogelsItemArrayCallback<TOutput>): void;
    createTable(options: CreateTablesOptions, callback: (err: Error, data: AWS.DynamoDB.CreateTableOutput) => void): void;
    createTable(callback: (err: Error, data: AWS.DynamoDB.CreateTableOutput) => void): void;
    updateTable(throughput: Throughput, callback: (err: Error, data: AWS.DynamoDB.UpdateTableOutput) => void): void;
    updateTable(callback: (err: Error, data: AWS.DynamoDB.UpdateTableOutput) => void): void;
    describeTable(callback: (err: Error, data: AWS.DynamoDB.DescribeTableOutput) => void): void;
    deleteTable(callback: (err: Error) => void): void;
    tableName(): string;

    after(action: LifeCycleAction, listner: (item: Item) => void): void;
    before(action: LifeCycleAction, listner: (data: any, next: (err: Error | null, data: any) => void) => void): void;
    config(config: ModelConfig): { name: string };
    validate(item: Item<TOutput>): { error: Error, value: any };
}

export type DynogelsItemCallback<T = Record<any, any>> = (err: Error, data: Item<T>) => void;
export type DynogelsItemArrayCallback<T = Record<any, any>> = (err: Error, data: Array<Item<T>>) => void;

export interface Throughput {
    readCapacity: number;
    writeCapacity: number;
}

export interface CreateItemOptions {
    expected?: { [key: string]: any };
    overwrite?: boolean;

    Expected?: AWS.DynamoDB.ExpectedAttributeMap;
    ReturnValues?: AWS.DynamoDB.ReturnValue;
    ReturnConsumedCapacity?: AWS.DynamoDB.ReturnConsumedCapacity;
    ReturnItemCollectionMetrics?: AWS.DynamoDB.ReturnItemCollectionMetrics;
    ConditionalOperator?: AWS.DynamoDB.ConditionalOperator;
    ConditionExpression?: AWS.DynamoDB.ConditionExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap;
    ExpressionAttributeValues?: { [key: string]: any };
}

export interface UpdateItemOptions {
    expected?: { [key: string]: any };

    AttributeUpdates?: AWS.DynamoDB.AttributeUpdates;
    Expected?: AWS.DynamoDB.ExpectedAttributeMap;
    ConditionalOperator?: AWS.DynamoDB.ConditionalOperator;
    ReturnValues?: AWS.DynamoDB.ReturnValue;
    ReturnConsumedCapacity?: AWS.DynamoDB.ReturnConsumedCapacity;
    ReturnItemCollectionMetrics?: AWS.DynamoDB.ReturnItemCollectionMetrics;
    UpdateExpression?: AWS.DynamoDB.UpdateExpression;
    ConditionExpression?: AWS.DynamoDB.ConditionExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap;
    ExpressionAttributeValues?: { [key: string]: any };
}

export interface DestroyItemOptions {
    Expected?: AWS.DynamoDB.ExpectedAttributeMap;
    ConditionalOperator?: AWS.DynamoDB.ConditionalOperator;
    ReturnValues?: AWS.DynamoDB.ReturnValue;
    ReturnConsumedCapacity?: AWS.DynamoDB.ReturnConsumedCapacity;
    ReturnItemCollectionMetrics?: AWS.DynamoDB.ReturnItemCollectionMetrics;
    ConditionExpression?: AWS.DynamoDB.ConditionExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap;
    ExpressionAttributeValues?: { [key: string]: any };
}

export interface GetItemOptions {
    AttributesToGet?: AWS.DynamoDB.AttributeNameList;
    ConsistentRead?: AWS.DynamoDB.ConsistentRead;
    ReturnConsumedCapacity?: AWS.DynamoDB.ReturnConsumedCapacity;
    ProjectionExpression?: AWS.DynamoDB.ProjectionExpression;
    ExpressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap;
}

export interface ModelConfig {
    tableName?: string;
    docClient?: any;
    dynamodb?: AWS.DynamoDB;
}

// Dynogels Item
export interface Item<T = Record<any, any>, K extends keyof T = keyof T> {
    get(): Pick<T, K>;
    get<TKey extends K>(key: TKey): T[TKey];
    set(params: Partial<T>): Item<T>;
    save(callback?: DynogelsItemCallback<T>): void;
    update(options: UpdateItemOptions, callback?: DynogelsItemCallback<T>): void;
    update(callback?: DynogelsItemCallback<T>): void;
    destroy(options: DestroyItemOptions, callback?: DynogelsItemCallback<T>): void;
    destroy(callback?: DynogelsItemCallback<T>): void;
    toJSON(): Pick<T, K>;
    toPlainObject(): Pick<T, K>;
}

export interface BaseChain<T> {
    equals(value: any): T;
    eq(value: any): T;
    lte(value: any): T;
    lt(value: any): T;
    gte(value: any): T;
    gt(value: any): T;
    null(): T;
    exists(): T;
    beginsWith(value: any): T;
    between(value1: any, value2: any): T;
}

export interface ExtendedChain<T> extends BaseChain<T> {
    contains(value: any): T;
    notContains(value: any): T;
    in(values: any[]): T;
    ne(value: any): T;
}

export type MaybeArray<T> = T | T[];

export interface QueryResponse<T = Record<any, any>, K extends keyof T = keyof T> {
  Items: Array<Item<T, K>>,
  Count: number,
  ScannedCount: number,
}

// Dynogels Query
export interface Query<T = Record<any, any>, K extends keyof T = keyof T> {
    limit(number: number): Query<T, K>;
    filterExpression(expression: any): Query<T, K>;
    expressionAttributeNames(data: any): Query<T, K>;
    expressionAttributeValues(data: any): Query<T, K>;
    projectionExpression(data: any): Query<T, K>;
    usingIndex(name: string): Query<T, K>;
    consistentRead(read: boolean): Query<T, K>;
    addKeyCondition(condition: any): Query<T, K>;
    addFilterCondition(condition: any): Query<T, K>;
    startKey(hashKey: any, rangeKey: any): Query<T, K>;
    attributes<TKeys extends keyof T>(attrs: MaybeArray<TKeys>): Query<T, TKeys>;
    ascending(): Query<T, K>;
    descending(): Query<T, K>;
    select(value: any): Query<T, K>;
    returnConsumedCapacity(value: any): Query<T, K>;
    loadAll(): Query<T, K>;
    where(keyName: string): BaseChain<Query<T, K>>;
    filter(keyName: string): ExtendedChain<Query<T, K>>;
    exec(): stream.Readable;
    exec(callback: (err: Error, data: QueryResponse<T, K>) => void): void;
}

export interface ScanWhereChain<T, K extends keyof T> extends ExtendedChain<Scan<T, K>> {
    notNull(): Scan<T, K>;
}

// Dynogels Scan
export interface Scan<T = Record<any, any>, K extends keyof T = keyof T> {
    limit(number: number): Scan<T, K>;
    addFilterCondition(condition: any): Scan<T, K>;
    startKey(hashKey: any, rangeKey?: any): Scan<T, K>;
    attributes<TKeys extends keyof T>(attrs: MaybeArray<TKeys>): Scan<T, TKeys>;
    select(value: any): Scan<T, K>;
    returnConsumedCapacity(): Scan<T, K>;
    segments(segment: any, totalSegments: number): Scan<T, K>;
    where(keyName: string): ScanWhereChain<T, K>;
    filterExpression(expression: any): Scan<T, K>;
    expressionAttributeNames(data: any): Scan<T, K>;
    expressionAttributeValues(data: any): Scan<T, K>;
    projectionExpression(data: any): Scan<T, K>;
    exec(): stream.Readable;
    exec(callback: (err: Error, data: QueryResponse<T, K>) => void): void;
    loadAll(): Scan<T, K>;
}

export type tableResolve = () => string;

export interface SchemaType {
    [key: string]: joi.AnySchema | SchemaType;
}

export interface ModelConfiguration {
    hashKey: string;
    rangeKey?: string;
    timestamps?: boolean;
    createdAt?: boolean;
    updatedAt?: string;
    schema?: SchemaType;
    validation?: joi.ValidationOptions;
    tableName?: string | tableResolve;
    indexes?: any[];
    log?: Log;
}

export interface Document {
    [key: string]: any;
}

export interface DocumentCollection {
    Items: Document[];
    Count: number;
    ScannedCount: number;
}

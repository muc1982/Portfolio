import { Injectable } from '@angular/core';

export interface ErrorInfo {
  message: string;
  context: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorLog: ErrorInfo[] = [];

  handleError(error: any, context: string = ''): void {
    const errorInfo: ErrorInfo = {
      message: this.extractErrorMessage(error),
      context,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error(`Error in ${context}:`, error);
    this.errorLog.push(errorInfo);
    if (this.isProduction()) {
      this.sendErrorToService(errorInfo);
    }
    
    this.showUserNotification(errorInfo);
  }

  handleHttpError(error: any, context: string = ''): void {
    const httpContext = `HTTP ${context}`;
    
    if (error.status) {
      switch (error.status) {
        case 400:
          this.handleError(`Bad Request: ${error.message}`, httpContext);
          break;
        case 401:
          this.handleError(`Unauthorized: ${error.message}`, httpContext);
          break;
        case 403:
          this.handleError(`Forbidden: ${error.message}`, httpContext);
          break;
        case 404:
          this.handleError(`Not Found: ${error.message}`, httpContext);
          break;
        case 500:
          this.handleError(`Server Error: ${error.message}`, httpContext);
          break;
        default:
          this.handleError(`HTTP ${error.status}: ${error.message}`, httpContext);
      }
    } else {
      this.handleError(error, httpContext);
    }
  }

  getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    return 'Unknown error occurred';
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' && 
           !window.location.hostname.includes('127.0.0.1');
  }

  private sendErrorToService(errorInfo: ErrorInfo): void {
  }

  private showUserNotification(errorInfo: ErrorInfo): void {
    if (!this.isProduction()) {
      console.warn('Error occurred:', errorInfo.message);
    }
  }
}
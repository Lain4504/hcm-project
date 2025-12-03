# Vercel Deployment Guide

## Environment Variables Setup

Trên Vercel dashboard, bạn cần thêm environment variable:

1. Vào project settings trên Vercel
2. Chọn **Environment Variables**
3. Thêm biến:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `your_actual_gemini_api_key`
   - **Environment**: Production, Preview, Development (chọn tất cả)

## Deploy Commands

Vercel sẽ tự động detect Astro project. Nếu cần custom:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Redeploy

Sau khi thêm environment variable, bạn cần **redeploy** project:

1. Vào tab **Deployments**
2. Click vào deployment mới nhất
3. Click **Redeploy**

## Verify

Sau khi deploy xong, test chatbot trên production URL để đảm bảo API route hoạt động đúng.

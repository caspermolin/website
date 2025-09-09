import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.join(process.cwd(), 'src/database/pages');

export async function GET() {
  try {
    if (!fs.existsSync(PAGES_DIR)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(PAGES_DIR);
    const pages = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(PAGES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const pageData = JSON.parse(fileContent);
        
        // Convert the existing page structure to our admin format
        const convertedPage = {
          id: pageData.id,
          title: pageData.title,
          slug: pageData.path,
          type: pageData.id === 'homepage' ? 'homepage' : pageData.id,
          status: 'published',
          created: pageData.lastModified || new Date().toISOString(),
          lastModified: pageData.lastModified || new Date().toISOString(),
          meta: {
            title: pageData.metadata?.title || pageData.title,
            description: pageData.metadata?.description || '',
            keywords: pageData.metadata?.keywords || []
          },
          blocks: pageData.sections?.map((section: any, index: number) => {
            // Convert specific block types to match editor expectations
            let convertedContent = { ...section.content };
            
            // Convert contact-info locations to contactInfo
            if (section.type === 'contact-info' && section.content.locations) {
              convertedContent = {
                ...section.content,
                contactInfo: section.content.locations.map((location: any) => ({
                  type: 'address',
                  label: location.name,
                  value: `${location.address}, ${location.postalCode} ${location.city}, ${location.country}`,
                  icon: ''
                }))
              };
              delete convertedContent.locations;
            }
            
            // Convert contact-form formFields to fields
            if (section.type === 'contact-form' && section.content.formFields) {
              convertedContent = {
                ...section.content,
                fields: section.content.formFields,
                submitText: section.content.submitText || 'Send Message',
                successMessage: section.content.successMessage || 'Thank you for your message!'
              };
              delete convertedContent.formFields;
            }
            
            // Convert studio-details studios structure
            if (section.type === 'studio-details' && section.content.studios) {
              convertedContent = {
                ...section.content,
                studios: section.content.studios
              };
            }
            
            // Convert equipment-list categories structure
            if (section.type === 'equipment-list' && section.content.categories) {
              convertedContent = {
                ...section.content,
                categories: section.content.categories
              };
            }
            
            // Convert stats number to value
            if (section.type === 'stats' && section.content.stats) {
              convertedContent = {
                ...section.content,
                stats: section.content.stats.map((stat: any) => ({
                  label: stat.label,
                  value: stat.number || stat.value,
                  description: stat.description || ''
                }))
              };
            }
            
            // Convert service-highlights highlights to services
            if (section.type === 'service-highlights' && section.content.highlights) {
              convertedContent = {
                ...section.content,
                services: section.content.highlights.map((highlight: any) => ({
                  title: highlight.title,
                  description: highlight.description,
                  icon: highlight.icon,
                  features: highlight.features || []
                }))
              };
              delete convertedContent.highlights;
            }
            
            return {
              id: section.id,
              type: section.type,
              order: index,
              visible: section.settings?.visibility !== 'hidden',
              content: {
                ...convertedContent,
                images: section.images || [],
                settings: section.settings || {}
              }
            };
          }) || []
        };
        
        pages.push(convertedPage);
      }
    }

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error reading pages:', error);
    return NextResponse.json({ error: 'Failed to read pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const page = await request.json();
    
    // Convert admin format back to existing page format
    const existingPageFormat = {
      id: page.id,
      title: page.title,
      path: page.slug,
      type: 'page',
      sections: page.blocks.map((block: any) => {
        // Convert editor format back to original JSON format
        let convertedContent = { ...block.content };
        
        // Convert contact-info contactInfo back to locations
        if (block.type === 'contact-info' && block.content.contactInfo) {
          convertedContent = {
            ...block.content,
            locations: block.content.contactInfo.map((info: any) => {
              const parts = info.value.split(', ');
              return {
                name: info.label,
                address: parts[0] || '',
                postalCode: parts[1]?.split(' ')[0] || '',
                city: parts[1]?.split(' ').slice(1).join(' ') || parts[2] || '',
                country: parts[parts.length - 1] || '',
                phone: '+31 20 123 4567',
                email: 'info@postavermaas.com'
              };
            })
          };
          delete convertedContent.contactInfo;
        }
        
        // Convert contact-form fields back to formFields
        if (block.type === 'contact-form' && block.content.fields) {
          convertedContent = {
            ...block.content,
            formFields: block.content.fields
          };
          delete convertedContent.fields;
        }
        
        // Convert stats value back to number
        if (block.type === 'stats' && block.content.stats) {
          convertedContent = {
            ...block.content,
            stats: block.content.stats.map((stat: any) => ({
              number: stat.value,
              label: stat.label
            }))
          };
        }
        
        // Convert service-highlights services back to highlights
        if (block.type === 'service-highlights' && block.content.services) {
          convertedContent = {
            ...block.content,
            highlights: block.content.services.map((service: any) => ({
              title: service.title,
              description: service.description,
              icon: service.icon,
              features: service.features || []
            }))
          };
          delete convertedContent.services;
        }
        
        return {
          id: block.id,
          name: block.id.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          type: block.type,
          content: convertedContent,
          images: block.content.images || [],
          settings: {
            ...block.content.settings,
            visibility: block.visible ? 'visible' : 'hidden'
          }
        };
      }),
      metadata: {
        title: page.meta.title,
        description: page.meta.description,
        keywords: page.meta.keywords,
        ogImage: '/og-image.jpg',
        canonical: page.slug,
        robots: 'index, follow'
      },
      settings: {
        theme: 'auto',
        layout: 'default',
        showBreadcrumbs: page.id !== 'homepage',
        showFooter: true,
        customCSS: '',
        customJS: ''
      },
      lastModified: new Date().toISOString()
    };

    // Save to individual page file
    const pageFile = path.join(PAGES_DIR, `${page.id}.json`);
    fs.writeFileSync(pageFile, JSON.stringify(existingPageFormat, null, 2));
    
    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }
}

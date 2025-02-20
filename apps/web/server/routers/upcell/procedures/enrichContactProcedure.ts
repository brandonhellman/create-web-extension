import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { procedure } from '../../../trpc';

export const EnchrichContactInput = z.object({
  linkedinUrl: z.string(),
});

export type EnchrichContactInputType = z.infer<typeof EnchrichContactInput>;

export const EnchrichContactOutput = z.object({
  contact: z.object({
    linkedinUrl: z.string(),
    mobilePhone: z.string(),
  }),
});

export type EnchrichContactOutputType = z.infer<typeof EnchrichContactOutput>;

export const enrichContactProcedure = procedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/upcell/enrichContact',
    },
  })
  .input(EnchrichContactInput)
  .output(EnchrichContactOutput)
  .query(async ({ input }) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'ba263df7fd8b06586d6d74f1068455b0748c5fcc1d3b95beb4eefd4141c27b65');

    const raw = JSON.stringify({
      linkedinUrl: input.linkedinUrl,
      fields: ['email', 'mobile'],
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch('https://app.upcell.io/v1/enrich/contact', requestOptions);
      const result: {
        contact: {
          Id: null;
          createdAt: null;
          updatedAt: null;
          firstName: string;
          middleName: string;
          lastName: string;
          emails: any[];
          mobilePhone: string; // '+16035470963'
          phoneNumbers: any[];
          linkedinUrl: string; // 'https://www.linkedin.com/in/marklbedard'
          socialProfiles: any[];
          gender: string;
          birthDate: null;
          locations: any[];
          currentJob: null;
          workHistory: any[];
          educations: any[];
          likelihoodToConnect: null;
          bestContactTime: null;
          tonality: null;
          providerIds: any[];
          location: string;
          sourcedAt: null;
        };
      } = await response.json();
      console.log('enrichContactProcedure:result', result);

      return result;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error while fetching data from Upcell',
      });
    }
  });

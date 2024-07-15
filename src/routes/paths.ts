// routes
// import { PATH_DASHBOARD } from '../../routes/paths';
export function getPaths(enable_panels: boolean, name_panel: string): any[] {
  const sidebarConfig = [
    {
      subheader: 'Visualización',
      items: [
        {
          title: 'Resumen',
          path: '/dashboard',
          icon: 'timeline'
        }
      ]
    },
    {
      subheader: 'CERTIFICADOS BLOCKCHAIN',
      items: [
        {
          title: 'Emitir certificados',
          path: '/dashboard/certificados',
          icon: 'credit_card'
        },
        {
          title: 'Certificados emitidos',
          path: '/dashboard/certificados_emitidos',
          icon: 'upload_file_rounded'
        },
        {
          title: 'Certificados recibidos',
          path: '/dashboard/certificados_recibidos',
          icon: 'sim_card_download'
        },
        {
          title: 'Compartidos',
          path: '/dashboard/compartir_certificados',
          icon: 'share'
        }
      ]
    },
    {
      subheader: 'PRODUCCIÓN',
      items: [
        {
          title: 'Prendas',
          path: '/dashboard/clothes',
          icon: 'checkroom'
        },
        enable_panels && {
          title: `${name_panel === 'Panel' ? `${name_panel}es` : `${name_panel}s`}`,
          path: '/dashboard/panels',
          icon: 'content_copy'
        },
        {
          title: 'Hilos',
          path: '/dashboard/yarns',
          icon: 'waves'
        }
      ]
    },

    // {
    //   subheader: 'PERFILES',
    //   items: [
    //     {
    //       title: 'Productores',
    //       path: '/dashboard/farmers',
    //       icon: 'person',
    //       children: [
    //         {
    //           path: '/dashboard/file_summary',
    //           title: 'Archivos subidos'
    //         },
    //         {
    //           path: '/dashboard/farmer-record',
    //           title: 'Ficha del productor'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Utilidad',
    //       path: '/dashboard/profit',
    //       icon: 'money',
    //       children: [
    //         {
    //           path: '/dashboard/profit_massive_load',
    //           title: 'Archivos subidos'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Agentes',
    //       path: '/dashboard/farm_agent',
    //       icon: 'group',
    //       children: [
    //         {
    //           path: '/dashboard/agentes_eliminados',
    //           title: 'Agentes eliminados'
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      subheader: 'Recolección de Datos',
      items: [
        {
          title: 'Formularios',
          path: '/dashboard/organization_form',
          icon: 'description',
          children: [
            {
              path: '/dashboard/response_form',
              title: 'Respuestas de formularios'
            }
            // {
            //   path: '/dashboard/organization_form_delete',
            //   title: 'Formularios eliminados'
            // },
            // {
            //   path: '/dashboard/map_selection',
            //   title: 'Seleccionar mapas'
            // }
          ]
        },
        {
          title: 'Subida masiva',
          path: '/dashboard/clothes_massive_load',
          icon: 'file_copy'
        }
      ]
    },
    {
      subheader: 'USUARIOS',
      items: [
        {
          title: 'Usuarios',
          path: '/dashboard/farm_agent',
          icon: 'group'
        }
      ]
    },
    // {
    //   subheader: 'APP CONNECT',
    //   items: [
    //     {
    //       title: 'Formularios',
    //       path: '/dashboard/organization_form',
    //       icon: 'description',
    //       children: [
    //         {
    //           path: '/dashboard/response_form',
    //           title: 'Respuestas de formularios'
    //         },
    //         {
    //           path: '/dashboard/organization_form_delete',
    //           title: 'Formularios eliminados'
    //         },
    //         {
    //           path: '/dashboard/map_selection',
    //           title: 'Seleccionar mapas'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   subheader: 'WHATSAPP',
    //   items: [
    //     {
    //       title: 'Formularios',
    //       path: '/dashboard/flows',
    //       icon: 'device_hub',
    //       title_header: 'Whatsapp - Formularios',
    //       children: [
    //         {
    //           path: '/dashboard/flows/response',
    //           title: 'Respuesta de Formularios',
    //           title_header: 'Whatsapp - Formularios'
    //         },
    //         {
    //           path: '/dashboard/flows/archived',
    //           title: 'Formularios archivados',
    //           title_header: 'Whatsapp - Formularios'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   subheader: 'Central de Comunicación',
    //   items: [
    //     // {
    //     //   title: 'Mis asesorías',
    //     //   path: '/dashboard/mis_asesorias',
    //     //   icon: 'star-filled'
    //     // },
    //     {
    //       title: 'Notificaciones',
    //       path: '/dashboard/notifications',
    //       icon: 'message-filled',
    //       children: [
    //         {
    //           path: '/dashboard/directory_requests',
    //           title: 'Solicitudes de acceso a información de directorio'
    //         }
    //       ]
    //     }
    //   ]
    // },

    {
      subheader: 'Configuraciones',
      items: [
        {
          title: 'Sobre la organización',
          path: '/dashboard/organization/profile',
          icon: 'settings'
        }
      ]
    }
  ];
  return sidebarConfig;
}
// export default sidebarConfig;

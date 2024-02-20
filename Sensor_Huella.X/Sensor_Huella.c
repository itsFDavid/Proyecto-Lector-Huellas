#pragma config PLLDIV = 2, CPUDIV = OSC1_PLL2, USBDIV = 2
#pragma config FOSC = HSPLL_HS, FCMEN = OFF, IESO = OFF
#pragma config PWRT = OFF, BOR = OFF, BORV = 3, VREGEN = OFF
#pragma config WDT = OFF
#pragma config WDTPS = 32768
#pragma config CCP2MX = ON, PBADEN = OFF, LPT1OSC = OFF, MCLRE = ON
#pragma config STVREN = ON, LVP = OFF, ICPRT = OFF, XINST = OFF
#pragma config CP0 = OFF, CP1 = OFF, CP2 = OFF, CP3 = OFF
#pragma config CPB = OFF, CPD = OFF
#pragma config WRT0 = OFF, WRT1 = OFF, WRT2 = OFF, WRT3 = OFF
#pragma config WRTC = OFF, WRTB = OFF, WRTD = OFF
#pragma config EBTR0 = OFF, EBTR1 = OFF, EBTR2 = OFF, EBTR3 = OFF
#pragma config EBTRB = OFF

#define _XTAL_FREQ 48000000
#include <xc.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#include "uart_soft.h"                      // Libreria del UART por software
#include "fingerprint.h"                    // Libreria del sensor de huella dactilar

char buf_rx[6];
char buf_tx[30];

uint8_t enter_id;
uint8_t n_users;
uint8_t c_empty, c_store, c_delete;

void main()
{
    ADCON1bits.PCFG = 0x0F;                 // Configura todos los pines como digitales
    TRISDbits.RD6 = 0;                      // Pin RD6 como salida (led ok)
    TRISDbits.RD7 = 0;                      // Pin RD7 como salida (led error)
    LATDbits.LD6 = 0;
    LATDbits.LD7 = 0;
    
    S_Uart_Init();                          // Inicializa puerto serial a 9600 baudios
    Fingerprint_Init(57600);                // Inicializa el sensor de huella dactilar
    Fingerprint_Read_Parameters();          // Lee los parametros del sensor de huella dactilar
    
    while(1)
    {
        S_Uart_Send_String("1: Buscar ID\r\n");
        S_Uart_Send_String("2: Registrar huella\r\n");
        S_Uart_Send_String("3: Eliminar huella\r\n");
        S_Uart_Send_String("4: Eliminar todo\r\n");
        S_Uart_Send_String("5: Cantidad de usuarios registrados\r\n\r\n");
        S_Uart_Read_String(buf_rx, 6);
        
        switch(buf_rx[0])
        {
            ///////////////////////// Buscar la huella almacenada /////////////////////////
            
            case '1':
                S_Uart_Send_String("Colocar dedo...\r\n");
                uint16_t id = Fingerprint_Get_ID();
                
                S_Uart_Send_String("Huella detectada\r\n");
                sprintf(buf_tx, "ID: %u\r\n", id);
                S_Uart_Send_String(buf_tx);
                
                if(id > 0){
                    LATDbits.LD6 = 1;
                    S_Uart_Send_String("ID encontrada en la base de datos\r\n");
                }else{
                    LATDbits.LD7 = 1;
                    S_Uart_Send_String("ID no encontrada en la base de datos\r\n");
                }
                S_Uart_Send_String("\r\n");
                __delay_ms(1500);
                LATDbits.LD6 = 0;
                LATDbits.LD7 = 0;
                break;
                
            /////////////////////////// Registrar nuevo usuario ///////////////////////////
            case '2':
                S_Uart_Send_String("Ingresar ID: \r\n");
                S_Uart_Read_String(buf_rx, 6);
                enter_id = (uint8_t)atoi(buf_rx);
                
                S_Uart_Send_String("Colocar dedo...\r\n");
                Fingerprint_GetImage();
                S_Uart_Send_String("Huella detectada\r\n");
                __delay_ms(1000);
                Fingerprint_Image2Tz(1);
                S_Uart_Send_String("Remover dedo\r\n");
                __delay_ms(1500);
                S_Uart_Send_String("Colocar dedo de nuevo...\r\n");
                Fingerprint_GetImage();
                Fingerprint_Image2Tz(2);
                Fingerprint_GetModel();
                c_store = Fingerprint_StoreModel(enter_id);
                
                switch(c_store)
                {
                    case FINGERPRINT_OK:
                        S_Uart_Send_String("Huella almacenada correctamente\r\n");
                        sprintf(buf_tx, "ID: %u\r\n", enter_id);
                        S_Uart_Send_String(buf_tx);
                        break;
                        
                    case FINGERPRINT_PACKETRECIEVEERR:
                        S_Uart_Send_String("Error al recibir el paquete\r\n");
                        break;
                        
                    case FINGERPRINT_BADLOCATION:
                        S_Uart_Send_String("El ID de la pagina es mayor al limite soportado\r\n");
                        break;
                        
                    case FINGERPRINT_FLASHERR:
                        S_Uart_Send_String("Error al escribir en la memoria\r\n");
                        break;
                }
                S_Uart_Send_String("\r\n");
                break;
                
            ///////////////////////// Eliminar huella almacenada //////////////////////////
            case '3':
                S_Uart_Send_String("Ingresar ID: \r\n");
                S_Uart_Read_String(buf_rx, 6);
                enter_id = (uint8_t)atoi(buf_rx);
                
                c_delete = Fingerprint_DeleteModel(enter_id);
                
                switch(c_delete)
                {
                    case FINGERPRINT_OK:
                        S_Uart_Send_String("Huella eliminada correctamente\r\n");
                        sprintf(buf_tx, "ID: %u\r\n", enter_id);
                        S_Uart_Send_String(buf_tx);
                        break;
                        
                    case FINGERPRINT_PACKETRECIEVEERR:
                        S_Uart_Send_String("Error al recibir el paquete\r\n");
                        break;
                        
                    case FINGERPRINT_DELETEFAIL:
                        S_Uart_Send_String("Error al eliminar huella\r\n");
                        break;
                }
                S_Uart_Send_String("\r\n");
                break;
                
            ///////////////////// Eliminar todas la huella almacenadas ////////////////////
            case '4':
                c_empty = Fingerprint_EmptyDatabase();
                
                switch(c_empty)
                {
                    case FINGERPRINT_OK:
                        S_Uart_Send_String("Usuarios eliminados correctamente\r\n");
                        break;
                        
                    case FINGERPRINT_PACKETRECIEVEERR:
                        S_Uart_Send_String("Error al recibir el paquete\r\n");
                        break;
                        
                    case FINGERPRINT_DBCLEARFAIL:
                        S_Uart_Send_String("Error al eliminar\r\n");
                        break;
                }
                S_Uart_Send_String("\r\n");
                break;
                
            /////////////////////// Cantidad de usuarios almacenados //////////////////////
            case '5':
                n_users = Fingerprint_GetTemplateCount();
                sprintf(buf_tx, "Usuarios registrados: %u\r\n", n_users);
                S_Uart_Send_String(buf_tx);
                S_Uart_Send_String("\r\n");
                break;
        }
        __delay_ms(500);
    }
}
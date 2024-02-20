/* #include "fingerprint.h"
*
* Creada por: Ing. Abiezer Hernandez O.
* Fecha de creacion: 01/07/2022
* Electronica y Circuitos
*
*/

#define _XTAL_FREQ 48000000
#include <xc.h>
#include <stdint.h>
#include "fingerprint.h"

uint8_t cont_rx = 0;
uint8_t request_fingerprint[28];
uint8_t finger_size_l;
uint16_t checksum;

const uint8_t finger_read_data[12] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x03,0x0F,0x00,0x13};
const uint8_t finger_detect[12] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x03,0x01,0x00,0x05};
const uint8_t finger_img2tz_1[13] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x04,0x02,0x01,0x00,0x08};
const uint8_t finger_img2tz_2[13] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x04,0x02,0x02,0x00,0x09};
const uint8_t finger_get_model[12] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x03,0x05,0x00,0x09};
const uint8_t finger_template[12] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x03,0x1D,0x00,0x21};
const uint8_t finger_delete_all[12] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x03,0x0D,0x00,0x11};

uint8_t finger_sh[17] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x08,0x04,0x01,0x00,0x00,0x00,0x00,0x00,0x00};
uint8_t finger_store_model[15] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x06,0x06,0x01,0x00,0x00,0x00,0x00};
uint8_t finger_delete[16] = {0xEF,0x01,0xFF,0xFF,0xFF,0xFF,0x01,0x00,0x07,0x0C,0x00,0x00,0x00,0x01,0x00,0x00};

void Fingerprint_Init(unsigned long baud)
{
    unsigned int vx;
    TRISCbits.RC6 = 0;
    TRISCbits.RC7 = 1;
    TXSTA = 0x24;
    RCSTA = 0x90;
    BAUDCON = 0x00;
    BAUDCONbits.BRG16 = 1;
    vx = (unsigned int)(_XTAL_FREQ/(baud*4))-1;
    SPBRG = vx & 0x00FF;
    SPBRGH = vx >> 8;
    PIE1bits.RCIE = 1;
    PIR1bits.RCIF = 0;
    INTCONbits.PEIE = 1;
    INTCONbits.GIE = 1;
    __delay_ms(1000);
}

void Fingerprint_Send_Buffer(uint8_t* buf, uint8_t size)
{
    for(uint8_t i=0; i<size; i++)
    {
        while(TXSTAbits.TRMT == 0);
        TXREG = *buf++;
    }
}

void Fingerprint_Read_Parameters(void)
{
    Fingerprint_Send_Buffer((uint8_t*)finger_read_data, 12);
    cont_rx = 0;
    while(cont_rx != 27);
    __delay_us(300);
    finger_size_l = request_fingerprint[15];
    while(request_fingerprint[9] != FINGERPRINT_OK);
}

void Fingerprint_GetImage(void)
{
    do{  
        Fingerprint_Send_Buffer((uint8_t*)finger_detect, 12);
        cont_rx = 0;
        while(cont_rx != 11);
        __delay_us(300);       
    }while(request_fingerprint[9] != FINGERPRINT_OK); 
}

void Fingerprint_Image2Tz(uint8_t n)
{
    switch(n)
    {
        case 1:
            Fingerprint_Send_Buffer((uint8_t*)finger_img2tz_1, 13);
            break;
            
        case 2:
            Fingerprint_Send_Buffer((uint8_t*)finger_img2tz_2, 13);
            break;
    }
    cont_rx = 0;
    while(cont_rx != 11);
    __delay_us(300);
    while(request_fingerprint[9] != FINGERPRINT_OK);
}

void Fingerprint_Search(void)
{
    checksum = 0;
    finger_sh[14] = finger_size_l;
    checksum = (uint16_t)(14 + finger_sh[14]);
    finger_sh[15] = (uint8_t)(checksum >> 8);
    finger_sh[16] = (uint8_t)(checksum & 0xFF); 
    Fingerprint_Send_Buffer((uint8_t*)finger_sh, 17);
    cont_rx = 0;
    while(cont_rx != 15);
    __delay_us(300);
}

void Fingerprint_GetModel(void)
{
    Fingerprint_Send_Buffer((uint8_t*)finger_get_model, 12);
    cont_rx = 0;
    while(cont_rx != 11);
    __delay_us(300);
    while(request_fingerprint[9] != FINGERPRINT_OK);
}

uint8_t Fingerprint_StoreModel(uint8_t id)
{
    checksum = 0;
    finger_store_model[12] = id;
    checksum = (uint16_t)(14 + finger_store_model[12]);
    finger_store_model[13] = (uint8_t)(checksum >> 8);
    finger_store_model[14] = (uint8_t)(checksum & 0xFF); 
    Fingerprint_Send_Buffer((uint8_t*)finger_store_model, 15);
    cont_rx = 0;
    while(cont_rx != 11);
    __delay_us(300);
    while(request_fingerprint[9] != FINGERPRINT_OK);
    return request_fingerprint[9];
}

uint8_t Fingerprint_DeleteModel(uint8_t id)
{
    checksum = 0;
    finger_delete[11] = id;
    checksum = (uint16_t)(21 + finger_delete[11]);
    finger_delete[14] = (uint8_t)(checksum >> 8);
    finger_delete[15] = (uint8_t)(checksum & 0xFF); 
    Fingerprint_Send_Buffer((uint8_t*)finger_delete, 16);
    cont_rx = 0;
    while(cont_rx != 11);
    __delay_us(300);
    while(request_fingerprint[9] != FINGERPRINT_OK);
    return request_fingerprint[9];
}

uint8_t Fingerprint_GetTemplateCount(void)
{
    uint8_t usr = 0;
    Fingerprint_Send_Buffer((uint8_t*)finger_template, 12);
    cont_rx = 0;
    while(cont_rx != 13);
    __delay_us(300);
    while(request_fingerprint[9] != FINGERPRINT_OK);
    
    switch(request_fingerprint[9])
    {
        case FINGERPRINT_OK:
            usr = request_fingerprint[11];
            break;
            
        case FINGERPRINT_PACKETRECIEVEERR:
            return 0;
            break;
    }
    return usr;
}

uint8_t Fingerprint_EmptyDatabase(void)
{
    Fingerprint_Send_Buffer((uint8_t*)finger_delete_all, 12);
    cont_rx = 0;
    while(cont_rx != 11);
    __delay_us(300);
    while(request_fingerprint[9] != FINGERPRINT_OK);
    return request_fingerprint[9];
}

uint16_t Fingerprint_Get_ID(void)
{
    uint16_t page_id, sc;
    
    Fingerprint_GetImage();
    Fingerprint_Image2Tz(1);
    Fingerprint_Search();
    
    switch(request_fingerprint[9])
    {
        case FINGERPRINT_OK:
            page_id = (uint16_t)((request_fingerprint[10]<<8) | request_fingerprint[11]);
            sc = (uint16_t)((request_fingerprint[12]<<8) | request_fingerprint[13]);
            break;
            
        case FINGERPRINT_NOTFOUND:
            page_id = 0;
            break;
    }
    return page_id;
}

void __interrupt() INT_UART_RX()
{
    if(PIR1bits.RCIF == 1)
    {
        request_fingerprint[cont_rx++] = RCREG;
        PIR1bits.RCIF = 0;
    }
}
/* #include "uart_soft.h"
*
* Creada por: Ing. Abiezer Hernandez O.
* Fecha de creacion: 10/04/2021
* Electronica y Circuitos
*
*/

#define _XTAL_FREQ 48000000
#include <xc.h>
#include "uart_soft.h"

void S_Uart_Init(void)
{
  Soft_Uart_Tx = 1;
  Soft_Uart_Rx = 1;
  Soft_Uart_Tx_Dir = 0;
  Soft_Uart_Rx_Dir = 1;
  Soft_Uart_Tx = 1;
  __delay_us(BITPERIOD);
}

void S_Uart_Send_Char(char Data)
{
    unsigned char mask;
    Soft_Uart_Tx = 0;
    __delay_us(BITPERIOD);
    for(mask=0x01; mask!=0; mask=(unsigned char)(mask<<1))
    {
        if(Data&mask) Soft_Uart_Tx = 1;
        else Soft_Uart_Tx = 0;
        __delay_us(BITPERIOD_FOR);
    }
    Soft_Uart_Tx = 1;
    __delay_us(BITPERIOD);
}

void S_Uart_Send_String(char* Text)
{
    while(*Text != '\0'){
        S_Uart_Send_Char(*Text++);
    }
}

char S_Uart_Read(void)
{
    char mask;
    char Data = 0;
    while(Soft_Uart_Rx == 1);
    __delay_us(HALFBITPERIOD);
    for(mask=0x01; mask!=0; mask=(unsigned char)(mask<<1))
    {
        __delay_us(BITPERIOD_FOR_READ);
        if(Soft_Uart_Rx)Data = Data|mask;
    }
    __delay_us(BITPERIOD);
    return Data;
}

void S_Uart_Read_String(char* str, unsigned char size)
{
    unsigned char cont_buf = 0;
    char c;
    do
    {
        c = S_Uart_Read();
        str[cont_buf++] = c;
        if(cont_buf >= size) break;
    }while(c != '\n');
    str[cont_buf-2] = '\0';
    cont_buf = 0;
}
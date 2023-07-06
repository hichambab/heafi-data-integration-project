#!/usr/bin/env python
# coding: utf-8

# In[39]:


import psycopg2
import numpy as np
import matplotlib.pyplot as plt


# In[80]:



# Establish the database connection
conn = psycopg2.connect(host="localhost", dbname="DataIntegration",user="postgres",password="postgres",port=5432)
cursor = conn.cursor()

#  ENERGYCONSUMPTION Mwh
# Execute the query
query = "SELECT code, SUM(consumption) FROM public.energyconsumption GROUP BY code;"
cursor.execute(query)
# Fetch the results
results = cursor.fetchall()
grouped_values = {}
for row in results:
    code_value = row[0]
    consumption_value = row[1]

    if code_value in grouped_values:
        grouped_values[code_value].append(consumption_value)
    else:
        grouped_values[code_value] = [consumption_value]
# Format the values in Float data type 
    grouped_float_values_encons = {}

for key, values in grouped_values.items():
    float_values = [float(value) for value in values]
    grouped_float_values_encons[key] = float_values 
    
    
    # Plot the graph
    
    # Extract the keys and values from the grouped_float_values dictionary
keys = grouped_float_values_encons.keys()
values = grouped_float_values_encons.values()

# Plot the values
plt.figure(figsize=(8, 6))

plt.plot(keys, values)

# Add labels and title to the plot
plt.xlabel('States')
plt.ylabel('Energy Consumption')
plt.title('Grouped Values')

# Add legend
#plt.legend()

# Display the graph
plt.show()
#-------------------------------------------------------------------------------------     
#x = grouped_float_values_encons['AZ'][0]
#data_type = type(x)
#print(data_type)
#print(grouped_float_values_encons)
#------------------------------------------------------------------------------------- 
# ENERGYPRODUCTION PER STATE Mwh
# Execute the query
query = "SELECT state, SUM(generation_mwh) FROM public.energyproduction GROUP BY state;"
cursor.execute(query)
# Fetch the results
results = cursor.fetchall()
grouped_values_prod = {}
for row in results:
    state_value = row[0]
    generation_mwh_value = row[1]

    if state_value in grouped_values_prod:
        grouped_values_prod[state_value].append(generation_mwh_value)
    else:
        grouped_values_prod[state_value] = [generation_mwh_value]
        
        # Format the values in Float data type 
    grouped_float_values_prod = {}

for key, values in grouped_values_prod.items():
    float_values = [float(value) for value in values]
    grouped_float_values_prod[key] = float_values 
    
    
        # Plot the graph
    
    # Extract the keys and values from the grouped_float_values dictionary
keys = grouped_float_values_prod.keys()
values = grouped_float_values_prod.values()

# Plot the values
plt.figure(figsize=(8, 6))
plt.plot(keys, values)

# Add labels and title to the plot
plt.xlabel('States')
plt.ylabel('Energy Production')
plt.title('Grouped Values')

# Add legend
#plt.legend()

# Display the graph
plt.show()
#print(grouped_values_prod)
#------------------------------------------------------------------------------------- 
# ENERGY CONSUMPTION FROM DATA CETERS PER STATE  Kwh
# Execute the query
query = "SELECT statecode, ammountconsumedperyear_kwh FROM public.datacenterenergyconsumption;"
cursor.execute(query)
# Fetch the results
results = cursor.fetchall()
grouped_values_consdc = {}
for row in results:
    statecode_value = row[0]
    ammountconsumedperyear_kwh = row[1]

    if statecode_value in grouped_values_consdc:
        grouped_values_consdc[statecode_value].append(ammountconsumedperyear_kwh)
    else:
        grouped_values_consdc[statecode_value] = [ammountconsumedperyear_kwh]
        
        # Format the values in Float data type 
    grouped_float_values_consdc = {}

for key, values in grouped_values_consdc.items():
    float_values = [float(value) for value in values]
    grouped_float_values_consdc[key] = float_values 
    
        
    
        # Plot the graph
    
    # Extract the keys and values from the grouped_float_values dictionary
keys = grouped_float_values_consdc.keys()
values = grouped_float_values_consdc.values()

# Plot the values
plt.figure(figsize=(8, 6))
#for key, value in zip(keys, values):
#    plt.plot(value, label=key)
plt.plot(keys, values)
# Add labels and title to the plot
plt.xlabel('States')
plt.ylabel('Energy Consumption Data Centers')
#plt.title('Grouped Values')

# Add legend
#plt.legend()

# Display the graph

plt.show()
print(values)
#------------------------------------------------------------------------------------- 
# ENERGY PRODUCTION FROM SOLAR FARMS PER STATE
# Execute the query
query = "SELECT statecode, SUM(annualgeneration_gwh) FROM public.solarfarmproduction GROUP BY statecode;"
cursor.execute(query)
# Fetch the results
results = cursor.fetchall()
grouped_values_solfarm = {}
for row in results:
    statecode_value = row[0]
    annualgeneration_gwh = row[1]

    if statecode_value in grouped_values_solfarm:
        grouped_values_solfarm[statecode_value].append(annualgeneration_gwh)
    else:
        grouped_values_solfarm[statecode_value] = [annualgeneration_gwh]
        
        # Format the values in Float data type 
    grouped_float_values_solfarm = {}

for key, values in grouped_values_solfarm.items():
    float_values = [float(value)*1000 for value in values]
    grouped_float_values_solfarm[key] = float_values 
    
        # Plot the graph
    
    # Extract the keys and values from the grouped_float_values dictionary
keys = grouped_float_values_solfarm.keys()
values = grouped_float_values_solfarm.values()

# Plot the values
plt.figure(figsize=(8, 6))
plt.plot(keys, values)

# Add labels and title to the plot
plt.xlabel('States')
plt.ylabel('Energy Production Solar Farm')
plt.title('Grouped Values')

# Add legend
#plt.legend()

# Display the graph
plt.show()
print(grouped_float_values_solfarm)
#------------------------------------------------------------------------------------- 

# CALCULATIONS 
fkeys = ['NV','CA','IA','AZ']
ENERGY_CONSUMPTION = [grouped_float_values_encons.get(key) for key in keys]
ENERGY_PRODUCTION = [grouped_float_values_prod.get(key) for key in keys]
CONS_DATACENTERS = [grouped_float_values_consdc.get(key) for key in keys]
SOLFARM_PRODUCTION = [grouped_float_values_solfarm.get(key) for key in keys]


print(ENERGY_CONSUMPTION)
print(ENERGY_PRODUCTION)
print(CONS_DATACENTERS)
print(SOLFARM_PRODUCTION)
# Close the cursor and the connection
cursor.close()
conn.close()


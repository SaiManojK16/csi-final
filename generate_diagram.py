#!/usr/bin/env python3
"""
Generate N-Tier Architecture Wiring Diagram
"""
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

# Create figure
fig, ax = plt.subplots(1, 1, figsize=(10, 12))
ax.set_xlim(0, 12)
ax.set_ylim(0, 14)
ax.axis('off')

# Define colors
color_presentation = '#87CEEB'  # Light blue
color_business = '#90EE90'      # Light green
color_data = '#FFA500'          # Orange
color_storage = '#FF8C00'       # Dark orange
color_external = '#DDA0DD'      # Plum
color_service = '#98FB98'       # Pale green

# Define box styles
def draw_box(x, y, width, height, text, color, layer_label=None):
    """Draw a rounded rectangle box"""
    box = FancyBboxPatch((x, y), width, height,
                         boxstyle="round,pad=0.1", 
                         edgecolor='black',
                         facecolor=color,
                         linewidth=1.5)
    ax.add_patch(box)
    
    # Add text
    ax.text(x + width/2, y + height/2, text,
            ha='center', va='center',
            fontsize=9, fontweight='bold',
            wrap=True)
    
    # Add layer label if provided
    if layer_label:
        ax.text(x - 0.8, y + height/2, layer_label,
                ha='center', va='center',
                fontsize=10, fontweight='bold')

# Tier 1: Presentation Layer
draw_box(4, 12, 4, 1.2, 'Presentation Layer\nReact Frontend', 
         color_presentation, 'Tier 1')
draw_box(2.5, 10.2, 1.6, 0.6, 'React Router', color_service)
draw_box(4.3, 10.2, 1.6, 0.6, 'AuthContext', color_service)
draw_box(6.1, 10.2, 1.6, 0.6, 'APIService', color_service)
draw_box(7.9, 10.2, 1.6, 0.6, 'GeminiService', color_service)

# Tier 2: Business Logic Layer
draw_box(4, 8, 4, 1.2, 'Business Logic Layer\nExpress Backend', 
         color_business, 'Tier 2')
draw_box(3.2, 6.5, 1.3, 0.65, 'Express.js\nFramework', color_service)
draw_box(4.7, 6.5, 1.3, 0.65, 'Auth Middleware\n(JWT)', color_service)
draw_box(6.2, 6.5, 1.3, 0.65, 'REST API\nRoutes', color_service)

# Tier 3: Data Layer
draw_box(4.5, 5, 3, 1, 'Data Layer\nMongoose ODM', color_data, 'Tier 3')
draw_box(4.5, 3.5, 3, 0.8, 'User Model', color_data)

# Tier 4: Storage Layer
draw_box(4.5, 2, 3, 1, 'Storage Layer\nMongoDB Database', 
         color_storage, 'Tier 4')

# External Service
draw_box(9.5, 11.5, 2, 1, 'External Service\nGoogle Gemini AI', 
         color_external)

# Draw connections
# Within Presentation Layer (services communicate with main layer)
ax.annotate('', xy=(3.3, 10.8), xytext=(3.3, 11.2),
            arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))
ax.annotate('', xy=(5.1, 10.8), xytext=(5.1, 11.2),
            arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))
ax.annotate('', xy=(6.9, 10.8), xytext=(6.9, 11.2),
            arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))
ax.annotate('', xy=(8.7, 10.8), xytext=(8.7, 11.2),
            arrowprops=dict(arrowstyle='<->', lw=1.5, color='black'))

# Presentation to Business Logic (APIService communicates with backend)
ax.annotate('', xy=(6.2, 8), xytext=(6.9, 10.5),
            arrowprops=dict(arrowstyle='<->', lw=2, linestyle='--', 
                          color='blue', connectionstyle='arc3,rad=0'))
ax.text(7.5, 9, 'HTTP/HTTPS\nRESTful API\nJSON', fontsize=7, ha='left', va='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))

# Within Business Logic Layer (components communicate with Express backend)
ax.annotate('', xy=(3.85, 6.8), xytext=(6, 8),
            arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
ax.annotate('', xy=(5.35, 6.8), xytext=(6, 8),
            arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
ax.annotate('', xy=(6.85, 6.8), xytext=(6, 8),
            arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))

# Business Logic to Data Layer (routes use Mongoose ODM)
ax.annotate('', xy=(6, 5), xytext=(5.35, 6.83),
            arrowprops=dict(arrowstyle='<->', lw=2, linestyle='--', 
                          color='green', connectionstyle='arc3,rad=0'))
ax.annotate('', xy=(6, 5), xytext=(6.85, 6.83),
            arrowprops=dict(arrowstyle='<->', lw=2, linestyle='--', 
                          color='green'))
ax.text(8.5, 5.5, 'Mongoose\nODM', fontsize=8, ha='left', va='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))

# Within Data Layer
ax.annotate('', xy=(6, 3.5), xytext=(6, 5),
            arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))

# Data to Storage Layer
ax.annotate('', xy=(6, 2), xytext=(6, 3.3),
            arrowprops=dict(arrowstyle='<->', lw=2, linestyle='--', 
                          color='orange', connectionstyle='arc3,rad=0'))
ax.text(7.5, 2.5, 'MongoDB\nProtocol', fontsize=8, ha='left', va='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))

# External Service Connection (GeminiService to Google Gemini AI)
ax.annotate('', xy=(9.5, 12), xytext=(8.7, 10.5),
            arrowprops=dict(arrowstyle='<->', lw=2, linestyle='--', 
                          color='purple', connectionstyle='arc3,rad=0.2'))
ax.text(9, 11.5, 'HTTPS\nAsync\nAjax', fontsize=7, ha='center', va='center',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))

# Add title
ax.text(6, 13.5, 'N-Tier Architecture Wiring Diagram', 
        ha='center', va='center', fontsize=14, fontweight='bold')

# Save figure
plt.tight_layout()
plt.savefig('wiring_diagram.png', dpi=300, bbox_inches='tight', 
            facecolor='white', edgecolor='none')
plt.savefig('wiring_diagram.pdf', bbox_inches='tight', 
            facecolor='white', edgecolor='none')
print("Diagram saved as 'wiring_diagram.png' and 'wiring_diagram.pdf'")
print("You can now include the image in your LaTeX document using:")
print("\\includegraphics[width=\\textwidth]{wiring_diagram.png}")



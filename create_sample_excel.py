#!/usr/bin/env python3
"""
Create a comprehensive sample Excel file for German Speller
"""

import pandas as pd

# Comprehensive list of German words and phrases with Arabic translations
sample_data = {
    'German': [
        # Basic Greetings
        'Hallo',
        'Guten Morgen',
        'Guten Tag',
        'Guten Abend',
        'Gute Nacht',
        'Auf Wiedersehen',
        'Tschüss',
        'Bis später',
        
        # Common Expressions
        'Danke',
        'Bitte',
        'Entschuldigung',
        'Verzeihung',
        'Ja',
        'Nein',
        'Vielleicht',
        'Natürlich',
        
        # Questions
        'Wie geht es dir?',
        'Wie heißen Sie?',
        'Woher kommen Sie?',
        'Sprechen Sie Englisch?',
        'Verstehen Sie?',
        'Können Sie das wiederholen?',
        'Wie viel kostet das?',
        'Wo ist die Toilette?',
        
        # Responses
        'Mir geht es gut',
        'Ich heiße',
        'Ich komme aus',
        'Ich verstehe',
        'Ich verstehe nicht',
        'Langsamer bitte',
        'Das ist teuer',
        'Das ist billig',
        
        # Numbers
        'Eins',
        'Zwei',
        'Drei',
        'Vier',
        'Fünf',
        'Sechs',
        'Sieben',
        'Acht',
        'Neun',
        'Zehn',
        
        # Colors
        'Rot',
        'Blau',
        'Grün',
        'Gelb',
        'Schwarz',
        'Weiß',
        'Braun',
        'Grau',
        
        # Food & Drinks
        'Brot',
        'Käse',
        'Wasser',
        'Kaffee',
        'Tee',
        'Bier',
        'Wein',
        'Apfel',
        'Banane',
        'Kartoffel',
        
        # Family
        'Mutter',
        'Vater',
        'Sohn',
        'Tochter',
        'Bruder',
        'Schwester',
        'Oma',
        'Opa',
        
        # Time
        'Heute',
        'Gestern',
        'Morgen',
        'Woche',
        'Monat',
        'Jahr',
        'Stunde',
        'Minute',
        
        # Weather
        'Sonne',
        'Regen',
        'Schnee',
        'Wind',
        'Warm',
        'Kalt',
        'Schön',
        'Schlecht'
    ],
    'Arabic': [
        # Basic Greetings
        'مرحبا',
        'صباح الخير',
        'يوم سعيد',
        'مساء الخير',
        'ليلة سعيدة',
        'إلى اللقاء',
        'مع السلامة',
        'أراك لاحقا',
        
        # Common Expressions
        'شكرا',
        'من فضلك',
        'عذرا',
        'عذراً',
        'نعم',
        'لا',
        'ربما',
        'بالطبع',
        
        # Questions
        'كيف حالك؟',
        'ما اسمك؟',
        'من أين أنت؟',
        'هل تتحدث الإنجليزية؟',
        'هل تفهم؟',
        'هل يمكنك تكرار ذلك؟',
        'كم ثمن هذا؟',
        'أين الحمام؟',
        
        # Responses
        'أنا بخير',
        'اسمي',
        'أنا من',
        'أفهم',
        'أنا لا أفهم',
        'أبطأ من فضلك',
        'هذا مكلف',
        'هذا رخيص',
        
        # Numbers
        'واحد',
        'اثنان',
        'ثلاثة',
        'أربعة',
        'خمسة',
        'ستة',
        'سبعة',
        'ثمانية',
        'تسعة',
        'عشرة',
        
        # Colors
        'أحمر',
        'أزرق',
        'أخضر',
        'أصفر',
        'أسود',
        'أبيض',
        'بني',
        'رمادي',
        
        # Food & Drinks
        'خبز',
        'جبن',
        'ماء',
        'قهوة',
        'شاي',
        'بيرة',
        'نبيذ',
        'تفاح',
        'موز',
        'بطاطس',
        
        # Family
        'أم',
        'أب',
        'ابن',
        'ابنة',
        'أخ',
        'أخت',
        'جدة',
        'جد',
        
        # Time
        'اليوم',
        'أمس',
        'غدا',
        'أسبوع',
        'شهر',
        'سنة',
        'ساعة',
        'دقيقة',
        
        # Weather
        'شمس',
        'مطر',
        'ثلج',
        'ريح',
        'دافئ',
        'بارد',
        'جميل',
        'سيء'
    ]
}

def create_sample_excel():
    """Create the sample Excel file"""
    try:
        # Create DataFrame
        df = pd.DataFrame(sample_data)
        
        # Save to Excel
        filename = 'german_words_sample.xlsx'
        df.to_excel(filename, index=False, sheet_name='German-Arabic Words')
        
        print("✅ Sample Excel file created successfully!")
        print(f"📁 Filename: {filename}")
        print(f"📊 Contains {len(sample_data['German'])} German words with Arabic translations")
        print("\n📋 Categories included:")
        print("   • Basic Greetings (8 words)")
        print("   • Common Expressions (8 words)")
        print("   • Questions (8 words)")
        print("   • Responses (8 words)")
        print("   • Numbers (10 words)")
        print("   • Colors (8 words)")
        print("   • Food & Drinks (10 words)")
        print("   • Family (8 words)")
        print("   • Time (8 words)")
        print("   • Weather (8 words)")
        
        print(f"\n🎯 Ready to upload to: http://localhost:5001")
        print("💡 Upload this file to test the audio functionality!")
        
        return filename
        
    except Exception as e:
        print(f"❌ Error creating sample file: {e}")
        return None

if __name__ == "__main__":
    create_sample_excel()

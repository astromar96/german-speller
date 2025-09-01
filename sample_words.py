import pandas as pd

# Sample German words with Arabic translations
sample_data = {
    'German': [
        'Hallo',
        'Guten Morgen',
        'Guten Tag',
        'Guten Abend',
        'Auf Wiedersehen',
        'Danke',
        'Bitte',
        'Entschuldigung',
        'Ja',
        'Nein',
        'Wie geht es dir?',
        'Mir geht es gut',
        'Ich heiße',
        'Freut mich',
        'Sprechen Sie Englisch?',
        'Ich verstehe nicht',
        'Kannst du das wiederholen?',
        'Langsamer bitte',
        'Wo ist die Toilette?',
        'Wie viel kostet das?'
    ],
    'Arabic': [
        'مرحبا',
        'صباح الخير',
        'يوم سعيد',
        'مساء الخير',
        'إلى اللقاء',
        'شكرا',
        'من فضلك',
        'عذرا',
        'نعم',
        'لا',
        'كيف حالك؟',
        'أنا بخير',
        'اسمي',
        'تشرفت بمقابلتك',
        'هل تتحدث الإنجليزية؟',
        'أنا لا أفهم',
        'هل يمكنك تكرار ذلك؟',
        'أبطأ من فضلك',
        'أين الحمام؟',
        'كم ثمن هذا؟'
    ]
}

# Create DataFrame
df = pd.DataFrame(sample_data)

# Save to Excel
df.to_excel('sample_german_words.xlsx', index=False, sheet_name='German-Arabic Words')

print("Sample Excel file 'sample_german_words.xlsx' created successfully!")
print(f"Contains {len(sample_data['German'])} German words with Arabic translations.")
print("\nFirst few entries:")
print(df.head())

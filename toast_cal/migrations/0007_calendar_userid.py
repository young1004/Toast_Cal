# Generated by Django 3.0.4 on 2020-04-27 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('toast_cal', '0006_auto_20200424_1809'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendar',
            name='userID',
            field=models.CharField(default='none', max_length=30),
        ),
    ]

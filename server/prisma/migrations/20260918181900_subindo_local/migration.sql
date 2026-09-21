BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [emailVerified] BIT NOT NULL CONSTRAINT [user_emailVerified_df] DEFAULT 0,
    [image] NVARCHAR(max),
    [role] NVARCHAR(1000) CONSTRAINT [user_role_df] DEFAULT 'user',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [user_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[session] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [ipAddress] NVARCHAR(1000),
    [userAgent] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [session_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [session_token_key] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[account] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [accountId] NVARCHAR(1000) NOT NULL,
    [providerId] NVARCHAR(1000) NOT NULL,
    [accessToken] NVARCHAR(max),
    [refreshToken] NVARCHAR(max),
    [idToken] NVARCHAR(max),
    [accessTokenExpiresAt] DATETIME2,
    [refreshTokenExpiresAt] DATETIME2,
    [scope] NVARCHAR(max),
    [password] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [account_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [account_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [account_providerId_accountId_key] UNIQUE NONCLUSTERED ([providerId],[accountId])
);

-- CreateTable
CREATE TABLE [dbo].[verification] (
    [id] NVARCHAR(1000) NOT NULL,
    [identifier] NVARCHAR(1000) NOT NULL,
    [value] NVARCHAR(max) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [verification_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    CONSTRAINT [verification_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[banners] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(max) NOT NULL,
    [imageUrl] NVARCHAR(max) NOT NULL,
    [order] INT NOT NULL CONSTRAINT [banners_order_df] DEFAULT 0,
    [active] BIT NOT NULL CONSTRAINT [banners_active_df] DEFAULT 1,
    [linkUrl] NVARCHAR(max),
    [linkText] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [banners_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [banners_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[fleet_items] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(max) NOT NULL,
    [imageUrl] NVARCHAR(max) NOT NULL,
    [order] INT NOT NULL CONSTRAINT [fleet_items_order_df] DEFAULT 0,
    [active] BIT NOT NULL CONSTRAINT [fleet_items_active_df] DEFAULT 1,
    [category] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [fleet_items_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [fleet_items_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[notices] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(max) NOT NULL,
    [message] NVARCHAR(max),
    [imageUrl] NVARCHAR(max),
    [linkUrl] NVARCHAR(max),
    [linkText] NVARCHAR(1000),
    [active] BIT NOT NULL CONSTRAINT [notices_active_df] DEFAULT 1,
    [type] NVARCHAR(1000),
    [priority] INT CONSTRAINT [notices_priority_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [notices_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [notices_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[operational_bases] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(max) NOT NULL,
    [phones] NVARCHAR(max) NOT NULL,
    [whatsappNumber] NVARCHAR(1000) NOT NULL,
    [whatsappDisplay] NVARCHAR(1000) NOT NULL,
    [coverage] NVARCHAR(1000),
    [highlights] NVARCHAR(max),
    [coordinates] NVARCHAR(max),
    [googleMapsUrl] NVARCHAR(max) NOT NULL,
    [embedUrl] NVARCHAR(max) NOT NULL,
    [wazeUrl] NVARCHAR(max),
    [order] INT NOT NULL CONSTRAINT [operational_bases_order_df] DEFAULT 0,
    [active] BIT NOT NULL CONSTRAINT [operational_bases_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [operational_bases_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [operational_bases_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[site_contents] (
    [id] NVARCHAR(1000) NOT NULL,
    [key] NVARCHAR(1000) NOT NULL,
    [data] NVARCHAR(max) NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [site_contents_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [site_contents_key_key] UNIQUE NONCLUSTERED ([key])
);

-- CreateTable
CREATE TABLE [dbo].[commodities_cache] (
    [id] NVARCHAR(1000) NOT NULL,
    [key] NVARCHAR(1000) NOT NULL,
    [items] NVARCHAR(max) NOT NULL,
    [usdToBrl] FLOAT(53) NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    [nextUpdateAt] DATETIME2 NOT NULL,
    [source] NVARCHAR(1000) NOT NULL,
    [rawRates] NVARCHAR(max),
    CONSTRAINT [commodities_cache_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [commodities_cache_key_key] UNIQUE NONCLUSTERED ([key])
);

-- AddForeignKey
ALTER TABLE [dbo].[session] ADD CONSTRAINT [session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[account] ADD CONSTRAINT [account_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

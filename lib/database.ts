import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
    }
    return pool;
}

export interface KBInstance {
    id: number;
    owner_user_id: string;
    owner_email: string;
    root_folder_id: string;
    root_folder_name: string;
    created_at: Date;
    updated_at: Date;
}

export class DatabaseService {
    private pool: Pool;

    constructor() {
        this.pool = getPool();
    }

    /**
     * Create a new KB instance
     */
    async createKBInstance(
        ownerUserId: string,
        ownerEmail: string,
        rootFolderId: string,
        rootFolderName: string
    ): Promise<KBInstance> {
        const result = await this.pool.query(
            `INSERT INTO kb_instances (owner_user_id, owner_email, root_folder_id, root_folder_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [ownerUserId, ownerEmail, rootFolderId, rootFolderName]
        );
        return result.rows[0];
    }

    /**
     * Get KB instance by root folder ID
     */
    async getKBInstanceByFolderId(rootFolderId: string): Promise<KBInstance | null> {
        const result = await this.pool.query(
            'SELECT * FROM kb_instances WHERE root_folder_id = $1',
            [rootFolderId]
        );
        return result.rows[0] || null;
    }

    /**
     * Get KB instance by owner user ID
     */
    async getKBInstanceByOwner(ownerUserId: string): Promise<KBInstance | null> {
        const result = await this.pool.query(
            'SELECT * FROM kb_instances WHERE owner_user_id = $1',
            [ownerUserId]
        );
        return result.rows[0] || null;
    }

    /**
     * Delete KB instance
     */
    async deleteKBInstance(id: number): Promise<void> {
        await this.pool.query('DELETE FROM kb_instances WHERE id = $1', [id]);
    }

    /**
     * Log activity
     */
    async logActivity(
        kbInstanceId: number,
        userEmail: string,
        action: string,
        details?: string
    ): Promise<void> {
        await this.pool.query(
            `INSERT INTO activity_logs (kb_instance_id, user_email, action, details)
       VALUES ($1, $2, $3, $4)`,
            [kbInstanceId, userEmail, action, details]
        );
    }

    /**
     * Log sync event
     */
    async logSync(kbInstanceId: number, status: string, message?: string): Promise<void> {
        await this.pool.query(
            `INSERT INTO sync_logs (kb_instance_id, status, message)
       VALUES ($1, $2, $3)`,
            [kbInstanceId, status, message]
        );
    }

    /**
     * Initialize database schema
     */
    async initializeSchema(): Promise<void> {
        // This would be called on first run or via migration
        // For now, we'll handle it manually
        console.log('Database schema should be initialized via migration');
    }
}
